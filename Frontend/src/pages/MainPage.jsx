import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar.jsx';
import BookAdd from '../components/BookAdd.jsx';
import BookList from '../components/BookList.jsx';
import TopReviewers from '../components/TopReviewers.jsx';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';
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
    <div className="main-page">
      <Header />
      <Sidebar />
      <div className="content">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Enter ISBN to search for reviews" 
            value={isbn} 
            onChange={(e) => setIsbn(e.target.value)} 
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        {bookNotFound && <BookAdd isbn={isbn} />}
        {book && (
          <div>
            <h2>{book.title}</h2>
            <p>{book.author}</p>
            <img src={book.book_image} alt={book.title} />
            <h2>Reviews</h2>
            {reviews.map(review => (
              <div key={review._id} className="review-item">
                <p>{review.review_text}</p>
                <span>{review.username}</span>
                <span>{review.rating} Stars</span>
              </div>
            ))}
          </div>
        )}
        <BookList />
      </div>
      <div className="right-sidebar">
        <TopReviewers />
      </div>
    </div>
  );
};

export default MainPage;
