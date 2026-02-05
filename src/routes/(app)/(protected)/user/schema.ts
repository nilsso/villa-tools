import { PasswordSchema } from '$lib/auth';
import * as v from 'valibot';

export const UpdateUserSchema = v.object({
	email: v.pipe(v.string(), v.email('Must be a valid email.')),
});

export const ChangePasswordSchema = v.pipe(
	v.object({
		oldPassword: v.string(),
		newPassword: PasswordSchema,
		newPasswordConfirm: v.string(),
	}),
	v.forward(
		v.partialCheck(
			[['newPassword'], ['newPasswordConfirm']],
			(input) => input.newPassword === input.newPasswordConfirm,
			'Passwords to not match.'
		),
		['newPasswordConfirm']
	)
);

export type ChangePasswordSchema = v.InferOutput<typeof ChangePasswordSchema>;
