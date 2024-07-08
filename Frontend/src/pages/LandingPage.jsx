import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header.jsx';
import './LandingPage.css';

const LandingPage = () => {
  const [topBooks, setTopBooks] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/top-books');
        setTopBooks(response.data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Top-Bücher:', error);
        setTopBooks([]); // Fallback auf leeres Array bei Fehler
      }
    };

    const fetchTopUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/topreviewer');
        setTopUsers(response.data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Top-Benutzer:', error);
        setTopUsers([]); // Fallback auf leeres Array bei Fehler
      }
    };

    fetchTopBooks();
    fetchTopUsers();
  }, []);

  const redirectToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="landing-page">
      <Header />
      <div className="landing-content">
        <h1>Willkommen zu unserer Buch-Community</h1>
        <p>Lasst uns gegenseitig inspirieren und unsere Leidenschaft für Bücher teilen. Entdecke neue Bücher, schreibe Bewertungen und finde Gleichgesinnte.</p>
        <Link to="/register" className="register-button">Registriere dich jetzt</Link>
      </div>
      <div className="lists">
        <div className="top-books">
          <h2>Top Bücher</h2>
          <div className="scroll-list">
            {Array.isArray(topBooks) && topBooks.length > 0 ? (
              topBooks.map(book => (
                <div key={book._id} className="list-item">
                  <img src={book.book_image} alt={book.title} />
                  <span>{book.title}</span>
                  <button onClick={redirectToRegister}>Watch Reviews</button>
                </div>
              ))
            ) : (
              <p>Keine Top-Bücher gefunden</p>
            )}
          </div>
        </div>
        <div className="top-users">
          <h2>Top Benutzer</h2>
          <div className="scroll-list">
            {Array.isArray(topUsers) && topUsers.length > 0 ? (
              topUsers.map(user => (
                <div key={user._id} className="list-item">
                  <img src={user.profileImageUrl} alt={user.username} />
                  <span>{user.username}</span>
                  <button onClick={redirectToRegister}>View Profile</button>
                </div>
              ))
            ) : (
              <p>Keine Top-Benutzer gefunden</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
