/** Prisma client and added utilities.
 *
 * How you should import when only using the client:
 * ``ts
 * import prisma from '$lib/prisma';
 * ```
 *
 * How you should import when using client and utilities.
 * ```ts
 * import * as prisma from '$lib/prisma';
 * ```
 */
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '$generated/prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

// import { DATABASE_URL } from '$env/static/private';

const adapter = new PrismaBetterSqlite3({ url: 'file:./db.sqlite' });

export const client = new PrismaClient({ adapter });

export default client;

// ---------------------------------------------------------------------------------------------------------------------

/** Common Prisma error codes.
 *
 * [Prisma docs](https://www.prisma.io/docs/orm/reference/error-reference#error-codes)
 */
export const ErrorCode = {
	/** "Unique constraint failed" error code.
	 *
	 * > Unique constraint failed on the {constraint}
	 */
	UNIQUE_CONSTRAINT_FAILED: 'P2002',

	/** "Not found" error code.
	 *
	 * > An operation failed because it depends on one or
	 * > more records that were required but not found. {cause}"
	 */
	NOT_FOUND: 'P2025'
} as const;

/** Common Prisma error code values. */
export type ErrorCodeValue = (typeof ErrorCode)[keyof typeof ErrorCode];

/** Prisma error.
 *
 * Wraps PrismaClientKnownRequestError but where the specific
 * error code value is one of the common PrismaErrorCode choices.
 * */
export type PrismaError<T extends ErrorCodeValue = ErrorCodeValue> = Omit<
	PrismaClientKnownRequestError,
	'code'
> & {
	code: T;
};

/** Is value a known Prisma error? */
export function isPrismaError<T extends ErrorCodeValue>(
	err: unknown,
	code: T
): err is PrismaError<T> {
	return err instanceof PrismaClientKnownRequestError && err.code == code;
}
