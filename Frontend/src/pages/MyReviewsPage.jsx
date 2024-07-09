import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ReactStars from 'react-stars';

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
        console.log(response.data); // Log data
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
                  className='p-4 bg-white rounded-lg shadow-md flex items-start'
                >
                  {review.bookImage && (
                    <img
                      src={review.bookImage}
                      alt={review.bookTitle}
                      className='w-20 h-28 object-cover rounded mr-4'
                    />
                  )}
                  <div>
                    <h3 className='text-2xl font-semibold'>
                      {review.bookTitle}
                    </h3>
                    <p className='mt-2'>{review.review_text}</p>
                    <div className='mt-2 flex items-center'>
                      <span className='font-bold mr-2'>Bewertung:</span>
                      <ReactStars
                        count={5}
                        size={24}
                        value={review.rating}
                        edit={false}
                        half={false}
                        color2={'#ffd700'}
                      />
                    </div>
                  </div>
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
