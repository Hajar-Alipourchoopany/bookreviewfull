import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
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
        const response = await axios.get(`http://localhost:8000/api/books/${isbn}`, {
          withCredentials: true,
        });
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
    };

    try {
      const response = await axios.post('http://localhost:8000/api/reviews', newReview, {
        withCredentials: true,
      });
      setReviews([...reviews, response.data]);
      setNewReviewText('');
      setNewReviewRating(1);
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Bewertung:', error);
      if (error.response) {
        console.error('Serverantwort:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('Keine Antwort vom Server erhalten:', error.request);
      } else {
        console.error('Fehler bei der Erstellung der Anfrage:', error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      {book && (
        <div className="max-w-4xl mx-auto p-4">
          <h2 className="text-3xl font-bold mb-2">{book.title}</h2>
          <p className="text-lg mb-4">{book.author}</p>
          <img src={book.book_image} alt={book.title} className="w-48 h-64 object-cover mb-4" />
        </div>
      )}
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Bewertungen</h2>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white p-4 rounded shadow">
              <p className="text-gray-800">{review.review_text}</p>
              <span className="text-gray-600">{review.username}</span>
              <span className="text-yellow-500 ml-2">{review.rating} Stars</span>
            </div>
          ))}
        </div>
        {userData && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Neue Bewertung hinzufügen</h3>
            <form onSubmit={handleAddReview} className="space-y-4">
              <textarea
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              ></textarea>
              <select
                value={newReviewRating}
                onChange={(e) => setNewReviewRating(Number(e.target.value))}
                className="p-2 border border-gray-300 rounded"
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} Stars
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Bewertung hinzufügen
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookReviewsPage;
