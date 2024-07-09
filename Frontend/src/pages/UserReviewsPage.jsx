import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';

const UserReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/users/${userId}/reviews`,
          {
            withCredentials: true,
          }
        );
        setReviews(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Fehler beim Abrufen der Reviews:', error);
        setReviews([]);
      }
    };

    fetchUserReviews();
  }, [userId]);

  return (
    <div className='min-h-screen flex flex-col md:flex-row bg-gray-100'>
      <Sidebar />
      <div className='flex-grow p-6'>
        <h2 className='text-2xl font-bold mb-6'>Reviews von Benutzer</h2>
        {reviews.length > 0 ? (
          <ul className='space-y-4'>
            {reviews.map((review) => (
              <li key={review._id} className='bg-white p-4 rounded-lg shadow'>
                <h3 className='text-xl font-semibold'>{review.bookTitle}</h3>
                <p className='mt-2'>{review.review_text}</p>
                <p className='mt-2 text-yellow-500'>
                  Bewertung: {review.rating}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-gray-500'>Keine Reviews vorhanden</p>
        )}
      </div>
    </div>
  );
};

export default UserReviewsPage;
