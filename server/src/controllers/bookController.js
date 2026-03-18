const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { isMock } = require('../config/s3');

exports.getBooks = async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addBook = async (req, res) => {
  try {
    const { book_name, book_author, book_publication, book_cost } = req.body;
    let book_link = '';
    
    if (req.file) {
      if (isMock) {
        // Fallback placeholder if AWS not configured
        book_link = `https://mock-s3-link.com/books/${Date.now()}.pdf`;
      } else {
        book_link = req.file.location;
      }
    }

    const book = await prisma.book.create({
      data: {
        book_name,
        book_author,
        book_publication,
        book_cost: parseFloat(book_cost) || 0,
        book_link
      }
    });
    
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
