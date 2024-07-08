import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './UserReviewsPage.css';
import Sidebar from '../components/Sidebar.jsx';
import Header from '../components/Header.jsx';


const UserReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/users/${userId}/reviews`);
        setReviews(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Fehler beim Abrufen der Reviews:', error);
        setReviews([]); 
      }
    };

    fetchUserReviews();
  }, [userId]);

  return (
    <div className="user-reviews-page">
      <Header />
      <Sidebar />
      <h2>Reviews von Benutzer</h2>
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

export default UserReviewsPage;
