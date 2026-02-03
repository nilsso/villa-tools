/*
  Warnings:

  - Added the required column `name` to the `Roster` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Roster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Roster" ("id") SELECT "id" FROM "Roster";
DROP TABLE "Roster";
ALTER TABLE "new_Roster" RENAME TO "Roster";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
