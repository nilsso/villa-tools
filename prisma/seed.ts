import { faker } from '@faker-js/faker';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { range } from 'es-toolkit';
import * as v from 'valibot';
import { Valimock } from 'valimock';
import { PrismaClient } from '../generated/prisma/client';
import * as models from '../generated/prisma/models';
import * as schemas from '../generated/valibot';
import { createUser, hashPassword } from '../src/lib/server/auth';

const adapter = new PrismaBetterSqlite3({ url: 'file:./db.sqlite' });
const prisma = new PrismaClient({ adapter });
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

const ADMIN_EMAIL = 'admin@example.net';
const ADMIN_PASSWORD = 'password';

async function main() {
	await createUser(ADMIN_EMAIL, 'ADMIN', await hashPassword(ADMIN_PASSWORD));

	await Promise.all([prisma.roster.deleteMany(), prisma.school.deleteMany()]);
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
