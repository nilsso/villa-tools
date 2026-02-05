import {
	createSession,
	generateSessionToken,
	setSessionTokenCookie,
	verifyUserPassword,
} from '$lib/server/auth';
import prisma from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import { redirect as flashRedirect } from 'sveltekit-flash-message/server';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { LoginSchema } from './schema';

function redirectTo(url: URL): string {
	return url.searchParams.get('redirectTo') ?? '/';
}

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.session != null) {
		throw redirect(303, redirectTo(url));
	}
	const form = await superValidate(valibot(LoginSchema));
	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, valibot(LoginSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { email, password } = form.data;

		// Fetch and verify user.
		const user = await prisma.user.findUnique({ where: { email } });
		if (!(user && (await verifyUserPassword(user.id, password)))) {
			return message(form, 'Email not found or incorrect password.', { status: 400 });
		}

		// Create session.
		const sessionToken = generateSessionToken();
		const session = await createSession(user.id, sessionToken);
		setSessionTokenCookie(event, sessionToken, session.expires_at);
		return flashRedirect(
			redirectTo(event.url),
			{
				toast: {
					type: 'success',
					message: 'Login successful.',
				},
			},
			event
		);
	},
};
