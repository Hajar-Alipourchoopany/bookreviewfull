import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './BookReviewsPage.css';
import Header from '../components/Header.jsx';

const BookReviewsPage = () => {
  const { isbn } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(1);
  const { userData } = useAuth();

  useEffect(() => {
    const fetchBookAndReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/books/${isbn}`);
        setBook(response.data.book);
        setReviews(response.data.reviews);
      } catch (error) {
        console.error('Fehler beim Abrufen der Buchdaten und Bewertungen:', error);
      }
    };

    fetchBookAndReviews();
  }, [isbn]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    const newReview = {
      isbn,
      review_text: newReviewText,
      rating: newReviewRating,
      user_id: userData._id,
      username: userData.username
    };

    try {
      const response = await axios.post('/api/reviews', newReview);
      setReviews([...reviews, response.data]);
      setNewReviewText('');
      setNewReviewRating(1);
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Bewertung:', error);
    }
  };

  return (
    <div className="book-reviews-page">
      <Header />
      {book && (
        <div className="book-info">
          <h2>{book.title}</h2>
          <p>{book.author}</p>
          <img src={book.book_image} alt={book.title} />
        </div>
      )}
      <h2>Bewertungen</h2>
      <div className="reviews">
        {reviews.map(review => (
          <div key={review._id} className="review-item">
            <p>{review.review_text}</p>
            <span>{review.username}</span>
            <span>{review.rating} Stars</span>
          </div>
        ))}
      </div>
      {userData && (
        <div className="add-review">
          <h3>Neue Bewertung hinzufügen</h3>
          <form onSubmit={handleAddReview}>
            <textarea
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              required
            ></textarea>
            <select
              value={newReviewRating}
              onChange={(e) => setNewReviewRating(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map(rating => (
                <option key={rating} value={rating}>
                  {rating} Stars
                </option>
              ))}
            </select>
            <button type="submit">Bewertung hinzufügen</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BookReviewsPage;
