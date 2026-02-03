import * as prisma from '$lib/server/prisma';
import { fromDate, getLocalTimeZone, now as getNow } from '@internationalized/date';
import { hash, verify } from '@node-rs/argon2';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import type { RequestEvent } from '@sveltejs/kit';
import { omit } from 'es-toolkit';
import type { User, UserGroup, Session } from '../auth';
import { someAsync } from '$lib/utils';

/** Hash a password. */
export async function hashPassword(password: string): Promise<string> {
	return await hash(password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});
}

/** Verify password with password hash. */
export async function verifyPasswordHash(passwordHash: string, password: string): Promise<boolean> {
	return await verify(passwordHash, password);
}

/** Verify password is not one of password hashes. */
export async function verifyFreshPassword(
	oldPasswordHashes: string[],
	password: string
): Promise<boolean> {
	return !(await someAsync(oldPasswordHashes, async (ph) => verifyPasswordHash(ph, password)));
}

/** Create user result. */
export type CreateUserResult =
	| {
			success: true;
			message: string;
			user: User;
	  }
	| {
			success: false;
			message: string;
			user: undefined;
	  };

/** Create user. */
export async function createUser(
	email: string,
	group: UserGroup,
	passwordHash: string
): Promise<CreateUserResult> {
	try {
		const user = await prisma.client.user.create({
			data: {
				email: email,
				group,
				password_hash: passwordHash,
			},
		});
		return {
			success: true,
			message: 'User created successfully.',
			user: omit(user, ['password_hash']),
		};
	} catch (err) {
		if (prisma.isPrismaError(err, prisma.ErrorCode.UNIQUE_CONSTRAINT_FAILED)) {
			return {
				success: false,
				message: err.message,
				user: undefined,
			};
		} else {
			throw err;
		}
	}
}

/** Find user by ID. */
export async function findUser(id: string): Promise<User | undefined> {
	const user = await prisma.client.user.findUnique({ where: { id } });
	if (user) return omit(user, ['password_hash']);
}

/** Find user by email. */
export async function findUserByEmail(email: string): Promise<User | undefined> {
	const user = await prisma.client.user.findUnique({ where: { email } });
	if (user) return omit(user, ['password_hash']);
}

/** Fetch user password hash. */
export async function fetchUserPasswordHash(userId: string): Promise<string> {
	const user = await prisma.client.user.findUnique({ where: { id: userId } });
	if (user == null) throw new Error('Invalid user ID');
	return user.password_hash;
}

/** Fetch user old password hashes. */
export async function fetchOldPasswordHashes(userId: string): Promise<string[]> {
	const { password_hash: current } = await prisma.client.user.findUniqueOrThrow({
		where: { id: userId },
		select: { password_hash: true },
	});
	const old = await prisma.client.userOldPassword.findMany({
		where: { user_id: userId },
		select: { password_hash: true },
	});
	return [current, ...old.map((d) => d.password_hash)];
}

/** Update user password hash.
 *
 * Sets the user's password hash and creates a new {UserOldPassword} from the old password hash.
 *
 * @param userId - User ID.
 * @param newPasswordHash - The new password hash.
 */
export async function updateUserPasswordHash(userId: string, newPasswordHash: string) {
	const oldPasswordHash = await fetchUserPasswordHash(userId);
	await prisma.client.$transaction([
		prisma.client.userOldPassword.create({
			data: {
				user_id: userId,
				password_hash: oldPasswordHash,
			},
		}),
		prisma.client.user.update({
			where: { id: userId },
			data: {
				password_hash: newPasswordHash,
				password_reset: false,
			},
		}),
	]);
}

/** Generate random session token. */
export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

/** Make session ID from token.
 *
 * Converts a session token string to a session ID
 * by way of SHA-256 hashing and hexadecimal encoding.
 *
 * @param sessionToken - Session token to convert to session ID.
 * */
function makeSessionId(sessionToken: string): string {
	const encoder = new TextEncoder().encode(sessionToken);
	return encodeHexLowerCase(sha256(encoder));
}

/** Session expiration date offset. */
export const EXPIRATION_OFFSET = { days: 30 };

/** Session expiration reset date offset. */
export const EXPIRATION_RESET = { days: 15 };

/** Create session for user ID and session token. */
export async function createSession(userId: string, sessionToken: string): Promise<Session> {
	const sessionId = makeSessionId(sessionToken);
	const expiresAt = getNow(getLocalTimeZone()).add(EXPIRATION_OFFSET);
	const session = await prisma.client.session.create({
		data: {
			id: sessionId,
			user_id: userId,
			expires_at: expiresAt.toDate(),
		},
	});
	const user = await prisma.client.user.findUniqueOrThrow({ where: { id: userId } });
	return { ...session, user: omit(user, ['password_hash']) };
}

/** Delete session. */
export async function deleteSession(sessionId: string) {
	await prisma.client.session.delete({ where: { id: sessionId } });
}

/** Set session token cookie.
 *
 * @param event - Request event.
 * @param sessionToken - Session token.
 * @param expiresAt - Expires at date.
 */
export function setSessionTokenCookie(event: RequestEvent, sessionToken: string, expiresAt: Date) {
	event.cookies.set('session', sessionToken, {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		expires: expiresAt,
	});
}

/** Delete session token cookie. */
export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete('session', { path: '/' });
	// event.cookies.set('session', '', {
	// 	httpOnly: true,
	// 	path: '/',
	// 	secure: import.meta.env.PROD,
	// 	sameSite: 'lax',
	// 	maxAge: 0
	// });
}

/** Validate session token.
 *
 * First finds the session for the given session token.
 * If none found then returns null.
 * If expired then expunged from database and returns null.
 * If not too old then has its expiration date reset.
 * Then finally returns the session and user data.
 *
 * @param sessionToken - Session token.
 */
export async function validateSessionToken(sessionToken: string): Promise<Session | null> {
	const sessionId = makeSessionId(sessionToken);
	const session = await prisma.client.session.findUnique({
		where: { id: sessionId },
		include: { user: true },
	});
	if (!session) return null;
	const tz = getLocalTimeZone();
	const expiresAt = fromDate(session.expires_at, tz);
	const now = getNow(tz);
	if (expiresAt <= now) {
		// If expired then expunge it from the database.
		await deleteSession(session.id);
		return null;
	}
	if (expiresAt <= now.add(EXPIRATION_RESET)) {
		// If now is within 15 days of the expiration date
		// then reset the expiration date.
		session.expires_at = expiresAt.add(EXPIRATION_OFFSET).toDate();
		await prisma.client.session.update({
			where: { id: session.id },
			data: { expires_at: session.expires_at },
		});
	}
	return {
		...session,
		user: omit(session.user, ['password_hash']),
	};
}
