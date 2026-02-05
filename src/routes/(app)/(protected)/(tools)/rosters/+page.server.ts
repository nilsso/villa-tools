import { CreateSchoolSchema } from '$generated/valibot';
import prisma from '$lib/server/prisma';
import { faker } from '@faker-js/faker';
import { fail, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import type { InferInput } from 'valibot';
import { error } from '@sveltejs/kit';
import { checkUserGroup } from '$lib/auth';

type CreateSchoolInput = InferInput<typeof CreateSchoolSchema>;

function createSchoolFakerData(): CreateSchoolInput {
	return {
		name: faker.location.city(),
	};
}

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.session?.user;
	if (!user) throw error(401);

	const schools = await prisma.school.findMany({
		include: { rosters: true },
	});

	const createSchoolForm = checkUserGroup(user.group, 'MODERATOR')
		? await superValidate(createSchoolFakerData(), valibot(CreateSchoolSchema))
		: undefined;

	return {
		schools,
		createSchoolForm,
	};
};

export const actions: Actions = {
	createSchool: async ({ request, locals }) => {
		const user = locals.session?.user;
		if (!(user && checkUserGroup(user.group, 'MODERATOR'))) throw error(401);

		const form = await superValidate(request, valibot(CreateSchoolSchema));
		if (!form.valid) return fail(400, { form });

		await prisma.school.create({ data: form.data });

		return { form };
	},
};
