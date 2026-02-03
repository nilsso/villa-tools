import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';
import { UpdateRosterSchema } from '$generated/valibot';
import * as v from 'valibot';

export const DELETE: RequestHandler = async ({ params }) => {
	await prisma.roster.delete({
		where: { id: params.id },
	});
	return new Response(null, { status: 204 });
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	const json = await request.json();
	const data = v.parse(UpdateRosterSchema, json);
	await prisma.roster.update({ where: { id: params.id }, data });
	return new Response(null, { status: 204 });
};
