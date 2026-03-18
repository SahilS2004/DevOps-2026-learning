const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { upload } = require('../config/s3');

router.get('/', bookController.getBooks);
router.post('/', upload.single('book_file'), bookController.addBook);

module.exports = router;
