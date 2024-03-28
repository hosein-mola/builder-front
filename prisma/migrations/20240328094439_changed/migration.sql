/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Form` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Form" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "context" TEXT NOT NULL DEFAULT '[]',
    "visit" INTEGER NOT NULL DEFAULT 0,
    "submission" INTEGER NOT NULL DEFAULT 0,
    "sharedURL" TEXT NOT NULL
);
INSERT INTO "new_Form" ("context", "description", "id", "name", "published", "sharedURL", "submission", "userId", "visit") SELECT "context", "description", "id", "name", "published", "sharedURL", "submission", "userId", "visit" FROM "Form";
DROP TABLE "Form";
ALTER TABLE "new_Form" RENAME TO "Form";
CREATE UNIQUE INDEX "Form_sharedURL_key" ON "Form"("sharedURL");
CREATE UNIQUE INDEX "Form_userId_name_key" ON "Form"("userId", "name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
