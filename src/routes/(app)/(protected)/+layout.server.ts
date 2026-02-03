import { omit } from 'es-toolkit';
import type { LayoutServerLoad } from './$types';
import type { Session } from '$lib/auth';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = ({ locals, url }) => {
	if (!locals.session) {
		return redirect(303, `/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	}
	return {
		session: omit(locals.session, ['user']) as Session,
		user: locals.session.user,
	};
};
