import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from '../components/Sidebar.jsx';

const MyReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const { userData } = useAuth();

  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!userData || !userData.user._id) return;
      try {
        const response = await axios.get(
          `http://localhost:8000/api/users/${userData.user._id}/reviews`,
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
            withCredentials: true,
          }
        );
        setReviews(response.data || []);
      } catch (error) {
        console.error('Fehler beim Abrufen der Reviews:', error);
        setReviews([]);
      }
    };

    fetchUserReviews();
  }, [userData]);

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='flex flex-1'>
        <Sidebar />
        <div className='flex-1 p-4'>
          <h2 className='text-3xl font-bold mb-4'>Meine Reviews</h2>
          {reviews.length > 0 ? (
            <ul className='space-y-4'>
              {reviews.map((review) => (
                <li
                  key={review._id}
                  className='p-4 bg-white rounded-lg shadow-md'
                >
                  <h3 className='text-2xl font-semibold'>{review.bookTitle}</h3>
                  <p className='mt-2'>{review.review_text}</p>
                  <p className='mt-2 font-bold'>Bewertung: {review.rating}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-lg'>Keine Reviews vorhanden</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReviewsPage;
