import { loadFlash } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';
import { omit } from 'es-toolkit';
import type { Session } from '$lib/auth';

export const load: LayoutServerLoad = loadFlash(({ locals }) => {
	const session = locals.session;
	return {
		session: (session ? omit(session, ['user']) : undefined) as Session | undefined,
		user: session?.user,
	};
});
