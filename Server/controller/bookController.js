import models from '../model/schema.js';
const { Book, Review } = models;
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';

// UC01: Buch nach ISBN suchen inklusiv der Reviews
export const getBookByISBN = async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = await Book.findOne({ isbn }).populate('reviews');
    
    if (!book) {
      return res.status(404).json({ message: 'Buch nicht gefunden. Neues Buch erfassen.' });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Neues Buch erfassen
export const addNewBook = asyncHandler(async (req, res, next) => {
  const { title, author, isbn } = req.body;

  if (!req.file) {
    return next(new ErrorResponse('Kein Bild hochgeladen', 400));
  }

  const newBook = new Book({
    title,
    author,
    isbn,
    book_image: req.file.path,
  });

  await newBook.save();

  res.status(201).json({
    success: true,
    data: newBook,
  });
});

export const getTopBooks = async (req, res) => {
  try {
    const topBooks = await Book.aggregate([
      {
        $project: {
          title: 1,
          isbn: 1,
          book_image: 1,
          reviewCount: { $size: "$reviews" }
        }
      },
      { $sort: { reviewCount: -1 } },
      { $limit: 10 }
    ]);

    if (topBooks.length === 0) {
      return res.status(200).json({ message: 'Keine Bücher gefunden.', books: [] });
    }

    res.status(200).json({ books: topBooks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
