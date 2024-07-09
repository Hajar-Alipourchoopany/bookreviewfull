import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from '../components/Sidebar.jsx';

const FavoritesPage = () => {
  const { userData } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(1);
  const [currentBook, setCurrentBook] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userData || !userData.user._id) {
        console.error('Benutzerdaten nicht verfügbar');
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:8000/api/users/${userData.user._id}/favorites`,
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
            withCredentials: true,
          }
        );
        setFavorites(response.data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Favoriten:', error);
      }
    };

    fetchFavorites();
  }, [userData]);

  const handleReviewSubmit = async (bookId) => {
    if (!reviewText || !rating) {
      alert('Bitte Bewertungstext und Bewertung angeben');
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8000/api/reviews`,
        {
          isbn: bookId,
          review_text: reviewText,
          user_id: userData.user._id,
          rating: rating,
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
          withCredentials: true,
        }
      );
      alert('Bewertung erfolgreich hinzugefügt');
      setReviewText('');
      setRating(1);
      setCurrentBook(null);
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Bewertung:', error);
    }
  };

  return (
    <div className='min-h-screen flex flex-col md:flex-row bg-gray-100'>
      <Sidebar />
      <div className='flex-grow p-6'>
        <h2 className='text-2xl font-bold mb-6'>Meine Favoriten</h2>
        {favorites.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {favorites.map((book) => (
              <div
                key={book._id}
                className='bg-white p-4 rounded-lg shadow mb-4 flex flex-col items-center'
              >
                <img
                  src={book.book_image}
                  alt={book.title}
                  className='w-32 h-48 object-cover mb-4 rounded'
                />
                <h3 className='text-lg font-semibold mb-1'>{book.title}</h3>
                <p className='text-gray-700 mb-1'>by {book.author}</p>
                <p className='text-gray-500 mb-2'>ISBN: {book.isbn}</p>
                <button
                  className='bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700 mb-2'
                  onClick={() => setCurrentBook(book)}
                >
                  Write Review
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-gray-500'>Keine Favoriten vorhanden</p>
        )}
      </div>

      {currentBook && (
        <div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center'>
          <div className='bg-white p-6 rounded-lg shadow-lg'>
            <h2 className='text-xl font-bold mb-4'>
              Write a Review for {currentBook.title}
            </h2>
            <textarea
              className='w-full p-2 border rounded mb-4'
              rows='4'
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder='Your review'
            />
            <select
              className='w-full p-2 border rounded mb-4'
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} Stars
                </option>
              ))}
            </select>
            <div className='flex justify-end'>
              <button
                className='bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700 mr-2'
                onClick={() => handleReviewSubmit(currentBook.isbn)}
              >
                Submit Review
              </button>
              <button
                className='bg-gray-300 text-black py-1 px-3 rounded hover:bg-gray-500'
                onClick={() => setCurrentBook(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
