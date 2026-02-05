import {
	changeUserPassword,
	createUser,
	CreateUserSchema,
	deleteUser,
	type User,
} from '$lib/server/auth';
import prisma, { isNotFound } from '$lib/server/prisma';
import { omit } from 'es-toolkit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { ChangePasswordSchema, DeleteSchema, ToggleResetSchema, UpdateSchema } from './schema';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.session!.user;

	const users: User[] = (await prisma.user.findMany()).map((user) => omit(user, ['password_hash']));

	const createForm = await superValidate(
		{
			group: null!,
		},
		valibot(CreateUserSchema),
		{ errors: false }
	);
	const updateForm = await superValidate(valibot(UpdateSchema));
	const deleteForm = await superValidate(valibot(DeleteSchema));
	const changePasswordForm = await superValidate(valibot(ChangePasswordSchema));
	const toggleResetForm = await superValidate(valibot(ToggleResetSchema));

	return {
		user,
		users,
		createForm,
		updateForm,
		deleteForm,
		changePasswordForm,
		toggleResetForm,
	};
};

export const actions: Actions = {
	create: async (event) => {
		const form = await superValidate(event, valibot(CreateUserSchema));
		if (!form.valid) return fail(400, { form });

		const res = await createUser(form.data);
		if (!res.success) {
			return message(form, res.message, { status: 400 });
		}

		return { form };
	},

	update: async (event) => {
		const form = await superValidate(event, valibot(UpdateSchema));
		if (!form.valid) return fail(400, { form });

		try {
			await prisma.user.update({
				where: { id: form.data.userId },
				data: form.data.data,
			});
		} catch (err) {
			if (isNotFound(err)) {
				return message(form, 'User not found.', { status: 400 });
			}
			throw err;
		}

		return { form };
	},

	delete: async (event) => {
		const form = await superValidate(event, valibot(DeleteSchema));
		if (!form.valid) return fail(400, { form });

		const success = await deleteUser(form.data.userId);
		if (!success) {
			return message(form, 'User not found.', { status: 400 });
		}

		return { form };
	},

	changePassword: async (event) => {
		const form = await superValidate(event, valibot(ChangePasswordSchema));
		if (!form.valid) return fail(400, { form });

		console.debug(form);

		const success = await changeUserPassword(form.data.userId, form.data.password, {
			invalidateSessions: true,
		});
		if (!success) {
			return message(form, 'User not found.', { status: 400 });
		}

		return { form };
	},

	toggleReset: async (event) => {
		const form = await superValidate(event, valibot(ToggleResetSchema));
		if (!form.valid) return fail(400, { form });

		try {
			await prisma.user.update({
				where: { id: form.data.userId },
				data: { password_reset: form.data.password_reset },
			});
		} catch (err) {
			if (isNotFound(err)) {
				return message(form, 'User not found.', { status: 400 });
			}
			throw err;
		}

		return { form };
	},
};
