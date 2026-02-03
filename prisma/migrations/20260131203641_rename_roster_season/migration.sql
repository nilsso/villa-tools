/*
  Warnings:

  - You are about to drop the column `semester` on the `Roster` table. All the data in the column will be lost.
  - Added the required column `season` to the `Roster` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Roster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "school_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "season" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    CONSTRAINT "Roster_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "School" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Roster" ("id", "name", "school_id", "url", "year") SELECT "id", "name", "school_id", "url", "year" FROM "Roster";
DROP TABLE "Roster";
ALTER TABLE "new_Roster" RENAME TO "Roster";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
