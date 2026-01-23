/** Prisma utilities.
 *
 * Includes:
 *  - Prisma error constants and helpers.
 */
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

/** Common Prisma error codes. */
export const PrismaErrorCode = {
	NOT_FOUND: 'P2025',
	UNIQUE_CONSTRAINT_FAILED: 'P2002'
} as const;

/** Common Prisma error code values. */
export type PrismaErrorCodeValue = (typeof PrismaErrorCode)[keyof typeof PrismaErrorCode];

/** Prisma client known request error but with specific error code value. */
export type PrismaKnownError<T extends PrismaErrorCodeValue = PrismaErrorCodeValue> = Omit<
	PrismaClientKnownRequestError,
	'code'
> & {
	code: T;
};

export type NotFoundError = PrismaKnownError<typeof PrismaErrorCode.NOT_FOUND>;

/** Is value a known error. */
export function isKnownError<T extends PrismaErrorCodeValue>(
	err: unknown,
	code: T
): err is PrismaKnownError<T> {
	return err instanceof PrismaClientKnownRequestError && err.code == code;
}

function wrap<T extends PrismaErrorCodeValue>(value: T) {
	return (err: unknown) => isKnownError(err, value);
}

export const isNotFound = wrap(PrismaErrorCode.NOT_FOUND);
export const isUniqueConstraintFailed = wrap(PrismaErrorCode.UNIQUE_CONSTRAINT_FAILED);
