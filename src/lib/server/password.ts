import { hash, verify } from '@node-rs/argon2';

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
