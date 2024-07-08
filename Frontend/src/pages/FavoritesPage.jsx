import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import './FavoritesPage.css';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';



const FavoritesPage = () => {
  const { userData } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/users/${userData._id}/favorites`);
        setFavorites(response.data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Favoriten:', error);
      }
    };

    fetchFavorites();
  }, [userData._id]);

  return (
    <div className="favorites-page">
      <Sidebar />
      <Header />
      <h2>Meine Favoriten</h2>
      {favorites.map(review => (
        <div key={review._id} className="review-item">
          <p>{review.review_text}</p>
          <span>{review.rating} Stars</span>
        </div>
      ))}
    </div>
  );
};

export default FavoritesPage;
