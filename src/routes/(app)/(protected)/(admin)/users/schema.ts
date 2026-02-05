import { UserGroupEnum } from '$generated/valibot';
import { PasswordSchema } from '$lib/auth';
import * as v from 'valibot';

export const UpdateDataSchema = v.partial(
	v.object({
		email: v.pipe(v.string(), v.email('Must be a valid email.')),
		group: UserGroupEnum,
		password_reset: v.boolean(),
	})
);

export const UpdateSchema = v.object({
	userId: v.string(),
	data: UpdateDataSchema,
});

export type UpdateSchema = v.InferOutput<typeof UpdateSchema>;

export const DeleteSchema = v.object({
	userId: v.string(),
});

export type DeleteSchema = v.InferOutput<typeof DeleteSchema>;

export const ChangePasswordSchema = v.pipe(
	v.object({
		userId: v.string(),
		password: PasswordSchema,
		passwordConfirm: v.string(),
	}),
	v.forward(
		v.partialCheck(
			[['password'], ['passwordConfirm']],
			(input) => input.password === input.passwordConfirm,
			'Passwords to not match.'
		),
		['passwordConfirm']
	)
);

export type ChangePasswordSchema = v.InferOutput<typeof ChangePasswordSchema>;

export const ToggleResetSchema = v.object({
	userId: v.string(),
	password_reset: v.boolean(),
});

export type ToggleResetSchema = v.InferOutput<typeof ToggleResetSchema>;
