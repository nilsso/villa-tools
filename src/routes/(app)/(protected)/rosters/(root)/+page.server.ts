import { CreateRosterSchema, CreateSchoolSchema } from '$generated/valibot';
import prisma from '$lib/server/prisma';
import { faker } from '@faker-js/faker';
import { fail, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const schools = await prisma.school.findMany({
		include: { rosters: true },
	});

	const schoolForm = await superValidate(
		{
			name: faker.location.city(),
		},
		valibot(CreateSchoolSchema)
	);

	return { schools, schoolForm };
};

export const actions: Actions = {
	createSchool: async (event) => {
		const form = await superValidate(event, valibot(CreateSchoolSchema));
		if (!form.valid) return fail(400, { form });
		await prisma.school.create({ data: form.data, select: null });
		return { form };
	},

	createRoster: async ({ request }) => {
		const form = await superValidate(request, valibot(CreateRosterSchema));
		if (!form.valid) return fail(400, { form });
		await prisma.roster.create({ data: form.data });
		return { form };
	},
};
