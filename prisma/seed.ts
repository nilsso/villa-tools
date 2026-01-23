import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaBetterSqlite3({ url: 'file:./db.sqlite' });
const prisma = new PrismaClient({ adapter });

async function main() {
	// await prisma.<model>.create({
	//   data: { ... }
	// });
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
