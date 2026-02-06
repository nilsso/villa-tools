# SvelteKit Prisma template

Featuring the following tools and packages:

- [Prisma](https://www.prisma.io/)
- [Valibot](https://valibot.dev/)
- [Valimock](https://github.com/Saeris/valimock/tree/main?tab=readme-ov-file)
- [Prisma Valibot Generator](https://github.com/omar-dulaimi/prisma-valibot-generator)

Authentication built following [Lucia](https://lucia-auth.com/sessions/basic)

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

## fly.io

Things I had to do

The package needs to include "onlyBuiltDependencies" for better-sqlite3 bindings

```
"pnpm": {
  "onlyBuiltDependencies": [
    "better-sqlite3",
    "@prisma/engines",
    "esbuild",
    "prisma"
  ]
}
```

Makefile needs to, in order:

- svelte-kit sync
- generate prisma client
- build

```
RUN pnpm svelte-kit sync

# Generate Prisma Client
COPY prisma .
RUN npx prisma generate

# Copy application code
COPY . .

# Build application
RUN pnpm run build
```

Database URL needs to be in fly.toml environment variables
but also in build args since prisma depends on it

```
[build]
  [build.args]
    DATABASE_URL = "file:/app/sqlite.db"

[env]
  DATABASE_URL = "file:/app/sqlite.db"
```
