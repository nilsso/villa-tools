import { prisma } from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const words = await prisma.word.findMany();
	return {
		words
	};
};
