import {
	deleteSessionTokenCookie,
	setSessionTokenCookie,
	validateSessionToken,
} from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('session') ?? null;
	if (sessionToken == null) {
		event.locals.session = null;
		return resolve(event);
	}
	const session = await validateSessionToken(sessionToken);
	if (session != null) {
		setSessionTokenCookie(event, sessionToken, session.expires_at);
		event.locals.session = session;
	} else {
		deleteSessionTokenCookie(event);
		event.locals.session = null;
	}
	return resolve(event);
};
