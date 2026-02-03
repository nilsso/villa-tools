import { CreateUserSchema } from '$generated/valibot';
import prisma from '$lib/server/prisma';
import { omit } from 'es-toolkit';
import { fail, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { createUser } from '$lib/auth';
import { hashPassword } from '$lib/server/auth';

export const load: PageServerLoad = async () => {
	const users = await prisma.user.findMany();

	const createUserForm = await superValidate(
		{
			group: 'USER',
		},
		valibot(CreateUserSchema)
	);

	return {
		users: users.map((user) => omit(user, ['password_hash'])),
		createUserForm,
	};
};

export const actions: Actions = {
	createUser: async (event) => {
		const form = await superValidate(event, valibot(CreateUserSchema));
		if (!form.valid) return fail(400, { form });
		const { email, group, password_hash: password } = form.data;
		await createUser(email, group, await hashPassword(password));
		return { form };
	},
};
