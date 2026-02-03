/*
  Warnings:

  - The primary key for the `UserOldPassword` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserOldPassword` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserOldPassword" (
    "user_id" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("user_id", "password_hash"),
    CONSTRAINT "UserOldPassword_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserOldPassword" ("created_at", "password_hash", "user_id") SELECT "created_at", "password_hash", "user_id" FROM "UserOldPassword";
DROP TABLE "UserOldPassword";
ALTER TABLE "new_UserOldPassword" RENAME TO "UserOldPassword";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
