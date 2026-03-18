const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { isMock } = require('../config/s3');

// 1. List all books
exports.getBooks = async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      orderBy: { created_at: 'desc' },
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Create a new Book
exports.addBook = async (req, res) => {
  try {
    const { book_name, book_author, book_publication, book_cost } = req.body;

    const book = await prisma.book.create({
      data: {
        book_name,
        book_author,
        book_publication,
        book_cost: parseFloat(book_cost) || 0,
        book_link: '',
      },
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Update Existing Book
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { book_name, book_author, book_publication, book_cost } = req.body;

    const updateData = {};
    if (book_name !== undefined) updateData.book_name = book_name;
    if (book_author !== undefined) updateData.book_author = book_author;
    if (book_publication !== undefined) updateData.book_publication = book_publication;
    if (book_cost !== undefined) updateData.book_cost = parseFloat(book_cost);

    const book = await prisma.book.update({
      where: { book_id: parseInt(id) },
      data: updateData,
    });

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Upload new book to AWS S3 storage and store link to db
exports.uploadBookFile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    let book_link = '';
    if (isMock) {
      book_link = `https://mock-s3-link.com/books/${Date.now()}.pdf`;
    } else {
      book_link = req.file.location;
    }

    const book = await prisma.book.update({
      where: { book_id: parseInt(id) },
      data: { book_link },
    });

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Delete Book
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.book.delete({
      where: { book_id: parseInt(id) },
    });
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
