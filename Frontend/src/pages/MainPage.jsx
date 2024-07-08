import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar.jsx';
import BookAdd from '../components/BookAdd.jsx';
import BookList from '../components/BookList.jsx';
import TopReviewers from '../components/TopReviewers.jsx';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';

const MainPage = () => {
  const [isbn, setIsbn] = useState('');
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [bookNotFound, setBookNotFound] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const bookResponse = await axios.get(`http://localhost:8000/api/books/${isbn}`);
      setBook(bookResponse.data.book);
      setReviews(bookResponse.data.reviews);
      setBookNotFound(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setBookNotFound(true);
      } else {
        console.error('Fehler beim Abrufen der Buchdaten:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col lg:flex-row">
          <div className="w-full lg:w-2/3 p-4">
            <div className="flex mb-4">
              <input 
                type="text" 
                placeholder="Enter ISBN to search for reviews" 
                value={isbn} 
                onChange={(e) => setIsbn(e.target.value)} 
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button 
                onClick={handleSearch} 
                className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-700"
              >
                Search
              </button>
            </div>
            {bookNotFound && <BookAdd isbn={isbn} />}
            {book && (
              <div className="mb-4">
                <h2 className="text-2xl font-bold">{book.title}</h2>
                <p className="text-gray-700">{book.author}</p>
                <img src={book.book_image} alt={book.title} className="w-full max-w-xs mt-2" />
                <h2 className="text-xl font-semibold mt-4">Reviews</h2>
                {reviews.map(review => (
                  <div key={review._id} className="review-item border-b border-gray-200 py-2">
                    <p>{review.review_text}</p>
                    <span className="text-gray-500">{review.username}</span>
                    <span className="text-yellow-500 ml-2">{review.rating} Stars</span>
                  </div>
                ))}
              </div>
            )}
            <BookList />
          </div>
          <div className="w-full lg:w-1/3 p-4">
            <TopReviewers />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
