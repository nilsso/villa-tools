import { PasswordSchema } from '$lib/auth';
import * as v from 'valibot';

export const ResetPasswordSchema = v.pipe(
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
