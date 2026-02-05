import { deleteSession } from '$lib/server/auth';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { redirect as flashRedirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	throw redirect(303, '/');
};

export const actions: Actions = {
	default: async (event) => {
		const session = event.locals.session;
		if (session === null) {
			return fail(401, { message: 'Not authenticated.' });
		}
		await deleteSession(session.id);
		return flashRedirect(
			'/login',
			{
				toast: {
					type: 'success',
					message: 'Logout successful.',
				},
			},
			event
		);
	},
};
