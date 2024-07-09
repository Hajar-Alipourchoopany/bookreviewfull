import express from 'express';
import {
  getBookByISBN,
  addNewBook,
  getTopBooks,
  searchBooks,
} from '../controller/bookController.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserReviews,
  getTopReviewer,
  uploadProfileImage,
  addBookToFavorites,
} from '../controller/userController.js';
import { addReview, deleteReview } from '../controller/reviewController.js';
import upload from '../middlewares/upload.js';
import verifyUser from '../middlewares/auth.js';

const router = express.Router();

// Buchrouten
router.get('/books/:isbn', getBookByISBN);
router.post('/books', upload.single('book_image'), addNewBook);
router.get('/top-books', getTopBooks);
router.get('/search/:query', searchBooks);

// Rezenssionenrouten
router.post('/reviews', addReview);
router.delete('/reviews/:reviewId', deleteReview);

// Benutzerrouten
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/users/:userId/reviews', getUserReviews);
router.post('/favorites', verifyUser, addBookToFavorites);
router.get('/topreviewer', getTopReviewer);
router.post(
  '/:userId/profile-image',
  upload.single('profileImageUrl'),
  uploadProfileImage
);

export default router;
