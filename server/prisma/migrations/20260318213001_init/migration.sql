-- CreateTable
CREATE TABLE "Book" (
    "book_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "book_name" TEXT NOT NULL,
    "book_author" TEXT NOT NULL,
    "book_publication" TEXT NOT NULL,
    "book_link" TEXT NOT NULL,
    "book_cost" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
