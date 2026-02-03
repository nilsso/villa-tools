import prisma from '$lib/server/prisma';
import type { RequestHandler } from './(root)/$types';
import { Valimock } from 'valimock';
import { faker } from '@faker-js/faker';
import * as schemas from '$generated/valibot';
import * as models from '$generated/prisma/models';
import { range } from 'es-toolkit';
import * as v from 'valibot';

const valimock = new Valimock({
	stringMap: {
		id: faker.string.uuid,
	},
});

function mockSchool(opts?: { numRosters?: number }): models.SchoolUncheckedCreateInput {
	const numRosters = opts?.numRosters ?? faker.number.int({ min: 1, max: 3 });
	return {
		...valimock.mock(schemas.SchoolSchema),
		rosters: {
			createMany: {
				data: range(numRosters).map(() =>
					valimock.mock(v.omit(schemas.RosterSchema, ['school_id']))
				),
			},
		},
	};
}

export const POST: RequestHandler = async () => {
	await prisma.school.create({ data: mockSchool() });
	return new Response(null, { status: 204 });
};

export const DELETE: RequestHandler = async () => {
	await Promise.all([prisma.roster.deleteMany(), prisma.school.deleteMany()]);
	return new Response(null, { status: 204 });
};
