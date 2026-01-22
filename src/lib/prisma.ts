import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '$generated/prisma/client';
// import { DATABASE_URL } from '$env/static/private';

const adapter = new PrismaBetterSqlite3({ url: 'file:./db.sqlite' });
const prisma = new PrismaClient({ adapter });

export { prisma };
