const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { upload } = require('../config/s3');

// 1. List all books
router.get('/', bookController.getBooks);

// 2. Create new book (metadata only)
router.post('/', upload.none(), bookController.addBook);

// 3. Upload book PDF to S3 and save link
router.post('/:id/upload', upload.single('book_file'), bookController.uploadBookFile);

// 4. Update existing book metadata
router.put('/:id', upload.none(), bookController.updateBook);

// 5. Delete book
router.delete('/:id', bookController.deleteBook);

module.exports = router;
