import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params }) => {
	await prisma.roster.deleteMany({ where: { school_id: params.id } });
	await prisma.school.delete({ where: { id: params.id } });
	return new Response(null, { status: 204 });
};
