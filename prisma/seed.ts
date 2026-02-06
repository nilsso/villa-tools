import 'dotenv/config';

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client';
import type { UserCreateInput } from '../generated/prisma/models';
import { hashPassword } from '../src/lib/server/password';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEFAULT_USERS: UserCreateInput[] = [
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
];

async function main() {
	for (const data of DEFAULT_USERS) {
		await prisma.user.upsert({
			where: { email: data.email },
			create: data,
			update: {},
		});
	}
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
