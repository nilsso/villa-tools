import { CreateRosterSchema, UpdateSchoolSchema } from '$generated/valibot';
import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import { faker } from '@faker-js/faker';
import { fail, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { now, getLocalTimeZone } from '@internationalized/date';
import { kebabCase, omit } from 'es-toolkit';

export const load: PageServerLoad = async ({ params: { id } }) => {
	const school = await prisma.school.findUnique({
		where: { id },
		include: { rosters: true },
	});
	if (!school) throw error(404, 'School not found');

	const nowLocal = now(getLocalTimeZone());
	const name = faker.location.street();
	const url = `https://${kebabCase(school.name)}.net/${kebabCase(name)}`;

	const updateSelfForm = await superValidate(school, valibot(UpdateSchoolSchema));

	const createRosterForm = await superValidate(
		{
			name,
			year: nowLocal.year,
			season: null!,
			url,
		},
		valibot(CreateRosterSchema),
		{ errors: false }
	);

	return {
		school,
		updateSelfForm,
		createRosterForm,
	};
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		let form = await superValidate(request, valibot(UpdateSchoolSchema));
		if (!form.valid) return fail(400, { form });
		const data = omit(form.data, ['id']);
		console.debug(params, data);
		const school = await prisma.school.update({ where: { id: params.id }, data });
		form = await superValidate(school, valibot(UpdateSchoolSchema));
		console.debug(form);
		return { form };
	},
};
