import { resolve } from '$app/paths';
import type { Pathname } from '$app/types';
import type { Session } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import { omit } from 'es-toolkit';
import type { LayoutServerLoad } from './$types';

function redirectTo(path: Pathname, url: URL) {
	const root = resolve(path);
	return url.pathname ? `${root}?redirectTo=${encodeURIComponent(url.pathname)}` : root;
}

export const load: LayoutServerLoad = (event) => {
	const { locals, url } = event;

	// Redirect to login
	if (!locals.session) {
		return redirect(303, redirectTo('/login', url));
	}

	// Redirect to reset
	if (locals.session.user.password_reset && url.pathname != '/user/reset-password') {
		return redirect(303, redirectTo('/user/reset-password', url));
	}

	return {
		session: omit(locals.session, ['user']) as Session,
		user: locals.session.user,
	};
};
