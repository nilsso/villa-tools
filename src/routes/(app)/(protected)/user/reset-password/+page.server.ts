import {
	fetchOldPasswordHashes,
	fetchUserPasswordHash,
	hashPassword,
	updateUserPasswordHash,
	verifyFreshPassword,
	verifyPasswordHash,
} from '$lib/server/auth';
import { error } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { ResetPasswordSchema } from '../schema';
import type { Actions, PageServerLoad } from './$types';

// import prisma from '$lib/server/prisma';

export const load: PageServerLoad = async () => {
	const form = await superValidate(
		{
			oldPassword: 'password',
			newPassword: 'foofoo',
			newPasswordConfirm: 'foofoo',
		},
		valibot(ResetPasswordSchema)
	);

	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.session) throw error(401);

		// Validate form.
		const form = await superValidate(request, valibot(ResetPasswordSchema));
		if (!form.valid) {
			return message(form, 'Form validation failed.', { status: 400 });
		}
		const data = form.data;

		// Validate old password.
		const user = locals.session.user;
		const oldPasswordHash = await fetchUserPasswordHash(user.id);
		if (!(await verifyPasswordHash(oldPasswordHash, data.oldPassword))) {
			form.errors.oldPassword = ['Incorrect password.'];
			return fail(401, { form });
		}

		// Check that new password is fresh.
		const oldPasswordHashes = await fetchOldPasswordHashes(user.id);
		const isFresh = await verifyFreshPassword(oldPasswordHashes, data.newPassword);
		if (!isFresh) {
			form.errors.newPassword = ['New password cannot have been used in the past.'];
			return fail(400, { form });
		}

		// Update password.
		try {
			const newPasswordHash = await hashPassword(form.data.newPassword);
			await updateUserPasswordHash(user.id, newPasswordHash);
		} catch (err) {
			console.error(err);
			return message(form, 'Server failed to update password', { status: 500 });
		}

		return { form };
	},
};
