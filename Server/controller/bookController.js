import models from '../model/schema.js';
const { Book, Review } = models;
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import axios from 'axios';

// UC01: Buch nach ISBN suchen inklusiv der Reviews
export const getBookByISBN = async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = await Book.findOne({ isbn }).populate('reviews');

    if (!book) {
      return res
        .status(404)
        .json({ message: 'Buch nicht gefunden. Neues Buch erfassen.' });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Neues Buch erfassen
export const addNewBook = asyncHandler(async (req, res, next) => {
  const { title, author, isbn } = req.body;

  // vheck if the book already exists
  const existingBook = await Book.findOne({ isbn });
  if (existingBook) {
    return next(
      new ErrorResponse('Buch mit dieser ISBN existiert bereits', 400)
    );
  }

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
          reviewCount: { $size: '$reviews' },
        },
      },
      { $sort: { reviewCount: -1 } },
      { $limit: 10 },
    ]);

    if (topBooks.length === 0) {
      return res
        .status(200)
        .json({ message: 'Keine Bücher gefunden.', books: [] });
    }

    res.status(200).json({ books: topBooks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// export const fetchBookFromAPI = asyncHandler(async (req, res, next) => {
//   const { isbn } = req.params;

//   try {
//     const existingBook = await Book.findOne({ isbn });
//     if (existingBook) {
//       console.log('Book already exists in the database:', existingBook);
//       return res.status(200).json(existingBook);
//     }

//     const response = await axios.get(
//       `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
//     );
//     console.log('Google Books API response:', response.data);

//     if (!response.data.items || response.data.items.length === 0) {
//       console.log('Book not found in Google Books API');
//       return next(new ErrorResponse('Buch nicht gefunden', 404));
//     }

//     const bookData = response.data.items[0].volumeInfo;
//     console.log('Book data from Google Books API:', bookData);

//     const newBook = new Book({
//       isbn,
//       title: bookData.title,
//       author: bookData.authors ? bookData.authors.join(', ') : 'Unknown',
//       book_image: bookData.imageLinks ? bookData.imageLinks.thumbnail : null,
//     });

//     await newBook.save();
//     console.log('New book saved to the database:', newBook);

//     res.status(200).json(newBook);
//   } catch (error) {
//     console.error('Error fetching book from Google Books API:', error.message);
//     return next(new ErrorResponse('Fehler beim Abrufen des Buches', 500));
//   }
// });

export const searchBooks = asyncHandler(async (req, res, next) => {
  const { query } = req.params;

  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}`
    );
    if (!response.data.items || response.data.items.length === 0) {
      return next(new ErrorResponse('Keine Bücher gefunden', 404));
    }

    const books = response.data.items.map((item) => ({
      isbn:
        item.volumeInfo.industryIdentifiers?.find((id) => id.type === 'ISBN_13')
          ?.identifier || 'ISBN nicht gefunden',
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors
        ? item.volumeInfo.authors.join(', ')
        : 'Unbekannter Autor',
      book_image: item.volumeInfo.imageLinks
        ? item.volumeInfo.imageLinks.thumbnail
        : null,
    }));

    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books from Google Books API:', error.message);
    return next(new ErrorResponse('Fehler beim Abrufen der Bücher', 500));
  }
});
