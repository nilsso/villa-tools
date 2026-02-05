import 'dotenv/config';

import { faker } from '@faker-js/faker';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { range } from 'es-toolkit';
import * as v from 'valibot';
import { Valimock } from 'valimock';
import { PrismaClient } from '../src/generated/prisma/client';
import * as models from '../src/generated/prisma/models';
import * as schemas from '../src/generated/valibot';
import { hashPassword } from '../src/lib/server/password';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const valimock = new Valimock({
	stringMap: {
		id: faker.string.uuid,
	},
});

export function mockSchool(opts?: { numRosters?: number }): models.SchoolUncheckedCreateInput {
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

async function main() {
	await prisma.$transaction([prisma.session.deleteMany(), prisma.user.deleteMany()]);

	await prisma.user.createMany({
		data: [
			{
				email: 'nils@villa.net',
				group: 'ADMIN',
				password_hash: await hashPassword('password'),
				super: true,
			},
			{
				email: 'admin@villa.net',
				group: 'ADMIN',
				password_hash: await hashPassword(''),
				password_reset: true,
			},
			{
				email: 'moderator@villa.net',
				group: 'MODERATOR',
				password_hash: await hashPassword(''),
				password_reset: true,
			},
			{
				email: 'user@villa.net',
				group: 'USER',
				password_hash: await hashPassword(''),
				password_reset: true,
			},
		],
	});

	// await Promise.all([prisma.roster.deleteMany(), prisma.school.deleteMany()]);
	// const numSchools = faker.number.int({ min: 1, max: 5 });
	// await Promise.all(range(numSchools).map(() => prisma.school.create({ data: mockSchool() })));
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
