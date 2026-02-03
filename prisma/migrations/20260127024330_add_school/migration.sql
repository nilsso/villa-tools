/*
  Warnings:

  - Added the required column `school_id` to the `Roster` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Roster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "school_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    CONSTRAINT "Roster_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "School" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Roster" ("id", "name", "url") SELECT "id", "name", "url" FROM "Roster";
DROP TABLE "Roster";
ALTER TABLE "new_Roster" RENAME TO "Roster";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
