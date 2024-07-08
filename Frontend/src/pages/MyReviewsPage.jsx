import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import './MyReviewsPage.css';
import Sidebar from '../components/Sidebar.jsx';
import Header from '../components/Header.jsx';

const MyReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const { userData } = useAuth();

  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!userData || !userData._id) return;
      try {
        const response = await axios.get(`http://localhost:8000/api/users/${userData._id}/reviews`);
        setReviews(response.data || []);
      } catch (error) {
        console.error('Fehler beim Abrufen der Reviews:', error);
        setReviews([]); // Setze die Reviews auf ein leeres Array im Fehlerfall
      }
    };

    fetchUserReviews();
  }, [userData]);

  return (
    <div className="my-reviews-page">
      <Header />
      <Sidebar />
      <h2>Meine Reviews</h2>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map(review => (
            <li key={review._id}>
              <h3>{review.bookTitle}</h3>
              <p>{review.reviewText}</p>
              <p>Bewertung: {review.rating}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Keine Reviews vorhanden</p>
      )}
    </div>
  );
};

export default MyReviewsPage;
