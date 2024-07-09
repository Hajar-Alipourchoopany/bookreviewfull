import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LandingPage = () => {
  const [topBooks, setTopBooks] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/top-books');
        setTopBooks(response.data.books);
      } catch (error) {
        console.error('Fehler beim Abrufen der Top-Bücher:', error);
        setTopBooks([]); // Fallback auf leeres Array bei Fehler
      }
    };

    const fetchTopUsers = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/topreviewer'
        );
        setTopUsers(response.data.reviewers);
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
    <div className='min-h-screen flex flex-col'>
      <div className='flex-1 flex flex-col items-center justify-center p-4'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold mb-4'>
            Willkommen zu unserer Buch-Community
          </h1>
          <p className='text-lg mb-4'>
            Lasst uns gegenseitig inspirieren und unsere Leidenschaft für Bücher
            teilen. Entdecke neue Bücher, schreibe Bewertungen und finde
            Gleichgesinnte.
          </p>
          <Link
            to='/register'
            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700'
          >
            Registriere dich jetzt
          </Link>
        </div>
        <div className='w-full max-w-4xl mt-8'>
          <div className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>Top Bücher</h2>
            <div className='flex overflow-x-auto space-x-4'>
              {Array.isArray(topBooks) && topBooks.length > 0 ? (
                topBooks.map((book) => (
                  <div
                    key={book._id}
                    className='flex-shrink-0 w-48 p-2 bg-white rounded-lg shadow-md'
                  >
                    <img
                      src={book.book_image}
                      alt={book.title}
                      className='w-full h-64 object-cover rounded-md'
                    />
                    <span className='block mt-2 text-center'>{book.title}</span>
                    <button
                      onClick={redirectToRegister}
                      className='mt-2 w-full bg-blue-500 text-white py-1 rounded-md hover:bg-blue-700'
                    >
                      Watch Reviews
                    </button>
                  </div>
                ))
              ) : (
                <p className='text-center'>Keine Top-Bücher gefunden</p>
              )}
            </div>
          </div>
          <div>
            <h2 className='text-2xl font-semibold mb-4'>Top Users</h2>
            <div className='flex overflow-x-auto space-x-4'>
              {Array.isArray(topUsers) && topUsers.length > 0 ? (
                topUsers.map((user) => (
                  <div
                    key={user._id}
                    className='flex-shrink-0 w-48 p-2 bg-white rounded-lg shadow-md'
                  >
                    <img
                      src={user.profileImageUrl}
                      alt={user.username}
                      className='w-full h-64 object-cover rounded-md'
                    />
                    <span className='block mt-2 text-center'>
                      {user.username}
                    </span>
                    <button
                      onClick={redirectToRegister}
                      className='mt-2 w-full bg-blue-500 text-white py-1 rounded-md hover:bg-blue-700'
                    >
                      View Profile
                    </button>
                  </div>
                ))
              ) : (
                <p className='text-center'>Keine Top-Benutzer gefunden</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
