import { checkUserGroup } from '$lib/auth';
import { error } from '@sveltejs/kit';
import { omit } from 'es-toolkit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
	const session = locals.session!;
	const user = session.user;

	if (!checkUserGroup(user.group, 'MODERATOR')) throw error(401);

	return {
		session: omit(session, ['user']),
		user,
	};
};
