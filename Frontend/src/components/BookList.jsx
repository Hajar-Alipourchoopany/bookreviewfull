import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/top-books');
        setBooks(response.data.books || []);
      } catch (error) {
        console.error('Fehler beim Abrufen der Top-Bücher:', error);
        setBooks([]); // Fallback to an empty array on error
      }
    };

    fetchTopBooks();
  }, []);

  const handleViewReviews = (isbn) => {
    navigate(`/book-reviews/${isbn}`);
  };

  return (
    <div className="book-list">
      <h2>Most Reviewed Books</h2>
      <div className="book-list-horizontal-scroll">
        {books.length > 0 ? (
          books.map(book => (
            <div key={book._id} className="book-item">
              <img src={book.book_image} alt={book.title} />
              <span>{book.title}</span>
              <button onClick={() => handleViewReviews(book.isbn)}>
                Watch Reviews
              </button>
            </div>
          ))
        ) : (
          <p>No books available</p>
        )}
      </div>
    </div>
  );
};

export default BookList;
