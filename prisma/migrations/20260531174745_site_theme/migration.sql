-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "address" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "social" TEXT NOT NULL DEFAULT '{}',
    "footerText" TEXT,
    "countersJson" TEXT NOT NULL DEFAULT '[]',
    "themeJson" TEXT NOT NULL DEFAULT '{}'
);
INSERT INTO "new_SiteSettings" ("address", "countersJson", "email", "footerText", "id", "phone", "social") SELECT "address", "countersJson", "email", "footerText", "id", "phone", "social" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
