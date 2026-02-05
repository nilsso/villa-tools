import { changeUserPassword, verifyUserPassword } from '$lib/server/auth';
import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { ChangePasswordSchema, UpdateUserSchema } from './schema';

export const load: PageServerLoad = async ({ locals }) => {
	const session = locals.session!;
	const user = session.user;

	const updateUserForm = await superValidate(user, valibot(UpdateUserSchema));
	const changePasswordForm = await superValidate(valibot(ChangePasswordSchema));

	return {
		updateUserForm,
		changePasswordForm,
	};
};

export const actions: Actions = {
	update: async ({ request, locals }) => {
		if (!locals.session) throw error(401);
		const user = locals.session.user;

		const form = await superValidate(request, valibot(UpdateUserSchema));
		if (!form.valid) return fail(400, { form });

		await prisma.user.update({
			where: { id: user.id },
			data: form.data,
		});
		return { form };
	},

	changePassword: async ({ request, locals }) => {
		if (!locals.session) throw error(401);

		// Validate form.
		const form = await superValidate(request, valibot(ChangePasswordSchema));
		if (!form.valid) return fail(400, { form });

		// Validate old password.
		const user = locals.session.user;
		if (!(await verifyUserPassword(user.id, form.data.oldPassword))) {
			form.errors.oldPassword = ['Incorrect password.'];
			return fail(401, { form });
		}

		// // Check that new password is fresh.
		// const oldPasswordHashes = await fetchOldPasswordHashes(user.id);
		// const isFresh = await verifyFreshPassword(oldPasswordHashes, data.newPassword);
		// if (!isFresh) {
		// 	form.errors.newPassword = ['New password cannot have been used in the past.'];
		// 	return fail(400, { form });
		// }

		// Update password.
		try {
			await changeUserPassword(user.id, form.data.newPassword, {
				resetFlag: false,
			});
		} catch (err) {
			console.error(err);
			return message(form, 'Server failed to update password.', { status: 500 });
		}

		return { form };
	},
};
