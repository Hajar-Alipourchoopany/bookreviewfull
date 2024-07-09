import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';

const FavoritesPage = () => {
  const { userData } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userData || !userData._id) {
        console.error('Benutzerdaten nicht verfügbar');
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8000/api/users/${userData._id}/favorites`, {
          withCredentials: true,
        });
        setFavorites(response.data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Favoriten:', error);
      }
    };

    fetchFavorites();
  }, [userData]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <Header />
      <Sidebar />
      <div className="flex-grow p-6">
        <h2 className="text-2xl font-bold mb-6">Meine Favoriten</h2>
        {favorites.length > 0 ? (
          favorites.map(review => (
            <div key={review._id} className="bg-white p-4 rounded-lg shadow mb-4">
              <p className="text-gray-700">{review.review_text}</p>
              <span className="text-yellow-500">{review.rating} Stars</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Keine Favoriten vorhanden</p>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
