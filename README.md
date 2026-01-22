# SvelteKit Prisma template

## Setup

```bash
pnpm install
```

**NOTE:** The `better-sqlite3` driver needs to be built but pnpm requires approval.

```bash
pnpm approve-builds
```

_Todo:_ There might be a flag to automatically approve and build when installing?

## Prisma

### Commands at a glance

To run a migration:

```bash
pnpm prisma migrate dev --name <NAME>
```

To generate the ORM

```bash
pnpm prisma generate
```

### Details and setup

**TODO:**

- Show how to setup env file with DATABASE_URL

The `./prisma/schema.prisma` schema file not only defines
the structure of the ORM but also the structure for the database as a whole.

The `prisma.config.ts` configuration file contains:

- A path to the schema file
- A path to the migrations directory, and
- A URL to the data source

By default our ORM will use SQLite as its provideer, and so
the configuration file provides an SQLite database file as the data source.

If starting from scratch, running an initial migration will create this file.

```bash
`pnpm prisma migrate dev --name init`
```
