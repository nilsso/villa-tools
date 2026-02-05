import { resolve } from '$app/paths';
import type { School } from '$generated/prisma/client';
import prisma from '$lib/server/prisma';
import { faker } from '@faker-js/faker';
import { getLocalTimeZone, now } from '@internationalized/date';
import { error } from '@sveltejs/kit';
import { kebabCase, omit } from 'es-toolkit';
import { redirect as flashRedirect, setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { InferInput } from 'valibot';
import type { Actions, PageServerLoad } from './$types';
import {
	CreateRosterSchema,
	DeleteRosterSchema,
	UpdateRosterSchema,
	UpdateSchoolSchema,
} from './schema';

type CreateRosterInput = InferInput<typeof CreateRosterSchema>;

function createRosterFakerData(school: School): CreateRosterInput {
	const nowLocal = now(getLocalTimeZone());
	const name = faker.location.street();
	const url = `https://${kebabCase(school.name)}.net/${kebabCase(name)}`;

	return {
		school_id: school.id,
		name,
		year: nowLocal.year,
		season: null!,
		url,
	};
}

export const load: PageServerLoad = async ({ params }) => {
	const schoolId = params.id;

	const school = await prisma.school.findUnique({
		where: { id: schoolId },
		include: { rosters: true },
	});
	if (!school) throw error(404, 'School not found');

	const updateSchoolForm = await superValidate(school, valibot(UpdateSchoolSchema));
	const createRosterForm = await superValidate(
		createRosterFakerData(school),
		valibot(CreateRosterSchema),
		{ errors: false }
	);
	const updateRosterForm = await superValidate(valibot(UpdateRosterSchema));
	const deleteRosterForm = await superValidate(valibot(DeleteRosterSchema));

	return {
		school,
		updateSchoolForm,
		createRosterForm,
		updateRosterForm,
		deleteRosterForm,
	};
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		let form = await superValidate(request, valibot(UpdateSchoolSchema));
		if (!form.valid) return fail(400, { form });

		const data = omit(form.data, ['id']);
		const school = await prisma.school.update({ where: { id: params.id }, data });

		form = await superValidate(school, valibot(UpdateSchoolSchema));

		return { form };
	},

	delete: async (event) => {
		const schoolId = event.params.id;

		try {
			await prisma.$transaction([
				prisma.roster.deleteMany({ where: { school_id: schoolId } }),
				prisma.school.delete({ where: { id: schoolId } }),
			]);
		} catch (err) {
			console.error(err);
			setFlash(
				{
					toast: {
						type: 'error',
						message: 'Failed to delete school.',
					},
				},
				event
			);
			return fail(500);
		}

		return flashRedirect(
			resolve('/rosters'),
			{
				toast: {
					type: 'success',
					message: 'School deleted.',
				},
			},
			event
		);
	},

	createRoster: async ({ request }) => {
		const form = await superValidate(request, valibot(CreateRosterSchema));
		if (!form.valid) return fail(400, { form });

		await prisma.roster.create({ data: form.data });

		return { form };
	},

	updateRoster: async ({ request }) => {
		const form = await superValidate(request, valibot(UpdateRosterSchema));
		if (!form.valid) return fail(400, { form });

		await prisma.roster.update({
			where: { id: form.data.rosterId },
			data: form.data.data,
		});

		return { form };
	},

	deleteRoster: async ({ request }) => {
		const form = await superValidate(request, valibot(DeleteRosterSchema));
		if (!form.valid) return fail(400, { form });

		await prisma.roster.delete({ where: { id: form.data.rosterId } });

		return { form };
	},
};
