import type { UserGroup } from '$generated/prisma/enums';
import type { SessionModel, UserModel } from '$generated/prisma/models';
import { UserGroupEnum } from '$generated/valibot';
import * as v from 'valibot';
import type { Nullish } from './utils';

export { UserGroup } from '$generated/prisma/enums';

/** User (password_hash allowed). */
export type UserWithPassword = UserModel;

/** User. */
export type User = Omit<UserWithPassword, 'password_hash'> & {
	password_hash?: never;
};

/** Create user schema. */
export const CreateUserSchema = v.object({
	email: v.string(),
	group: UserGroupEnum,
	password: v.string(),
	requireReset: v.optional(v.boolean(), false),
});

export type CreateUserInput = v.InferInput<typeof CreateUserSchema>;

export type CreateUserSchema = v.InferOutput<typeof CreateUserSchema>;

/** User group ranks.
 *
 * Note that lower value is higher rank (e.g. highest rank "ADMIN" is lowest value 0).
 */
export const USER_GROUP_RANK: Record<UserGroup, number> = {
	ADMIN: 0,
	MODERATOR: 1,
	USER: 2,
};

/** Check a user group value against another.
 *
 * @param test - User group to check.
 * @param against - User group to check against.
 * @returns If the check group {against} is satisfied by the test group.
 */
export function checkUserGroup(test: Nullish<UserGroup>, against: Nullish<UserGroup>): boolean {
	if (against == null) return true;
	if (test == null) return false;
	return USER_GROUP_RANK[test] <= USER_GROUP_RANK[against];
}

/** User session. */
export type Session = SessionModel & { user: User };

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 30;

export const PasswordSchema = v.pipe(
	v.string()
	// v.minLength(PASSWORD_MIN_LENGTH, `Cannot be less than ${PASSWORD_MIN_LENGTH} characters.`),
	// v.maxLength(PASSWORD_MAX_LENGTH, `cannot be more than ${PASSWORD_MAX_LENGTH} characters.`)
	// v.regex(/[a-z]/, 'Your password must contain a lowercase letter.'),
	// v.regex(/[A-Z]/, 'Your password must contain a uppercase letter.'),
	// v.regex(/[0-9]/, 'Your password must contain a number.'),
);
