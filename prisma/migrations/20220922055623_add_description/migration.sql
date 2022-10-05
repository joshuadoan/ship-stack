-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ship" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Ship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Ship" ("createdAt", "id", "name", "updatedAt", "userId") SELECT "createdAt", "id", "name", "updatedAt", "userId" FROM "Ship";
DROP TABLE "Ship";
ALTER TABLE "new_Ship" RENAME TO "Ship";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
