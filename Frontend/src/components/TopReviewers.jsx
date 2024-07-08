import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TopReviewers.css';

const TopReviewers = () => {
  const [topReviewers, setTopReviewers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopReviewers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/topreviewer');
        setTopReviewers(response.data.reviewers || []);
      } catch (error) {
        console.error('Fehler beim Abrufen der Top-Reviewer:', error);
        setTopReviewers([]); // Fallback to an empty array on error
      }
    };

    fetchTopReviewers();
  }, []);

  const handleUserClick = (userId) => {
    navigate(`/user-reviews/${userId}`);
  };

  return (
    <div className="top-reviewers">
      <h2>Top Reviewer</h2>
      {topReviewers.length > 0 ? (
        <ul>
          {topReviewers.map(reviewer => (
            <li key={reviewer._id} onClick={() => handleUserClick(reviewer._id)}>
              <img src={reviewer.profileImageUrl} alt={reviewer.username} />
              <span>{reviewer.username}</span>
              <span>{reviewer.reviewCount} Reviews</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Keine Reviewer gefunden.</p>
      )}
    </div>
  );
};

export default TopReviewers;
