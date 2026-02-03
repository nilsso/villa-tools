import { UpdateRosterSchema } from '$generated/valibot';
import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import { omit } from 'es-toolkit';
import { fail, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	throw error(400, { message: 'Foo' });
};

export const actions: Actions = {
	update: async (event) => {
		const form = await superValidate(event, valibot(UpdateRosterSchema));
		if (!form.valid) return fail(400, { form });
		await prisma.roster.update({
			where: { id: event.params.id },
			data: omit(form.data, ['id']),
		});
		console.debug(form);
		return { form };
	},
};
