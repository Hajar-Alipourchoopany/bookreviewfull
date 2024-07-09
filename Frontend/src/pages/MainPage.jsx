import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar.jsx';
import BookList from '../components/BookList.jsx';
import TopReviewers from '../components/TopReviewers.jsx';
import Header from '../components/Header.jsx';
import { SpinnerDotted } from 'spinners-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookNotFound, setBookNotFound] = useState(false);
  const { userData } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query) {
      console.error('Suchanfrage ist erforderlich');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/search/${query}`,
        {
          withCredentials: true,
        }
      );
      setBooks(response.data);
      setBookNotFound(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setBookNotFound(true);
      } else {
        console.error('Fehler beim Abrufen der Buchdaten:', error);
      }
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const addToFavorites = async (isbn) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/favorites`,
        { userId: userData.user._id, bookId: isbn },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
          withCredentials: true,
        }
      );
      setFavorites([...favorites, isbn]);
      console.log('Buch zu Favoriten hinzugefügt:', response.data);
    } catch (error) {
      console.error('Fehler beim Hinzufügen zu Favoriten:', error);
    }
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <div className='flex flex-1'>
        <Sidebar />
        <div className='flex-1 flex flex-col lg:flex-row p-4'>
          <div className='w-full lg:w-2/3 p-4'>
            <div className='flex mb-4'>
              <input
                type='text'
                placeholder='Suche nach ISBN, Titel oder Autor'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className='flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none'
              />
              <button
                onClick={handleSearch}
                className='p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-700'
              >
                Suche
              </button>
            </div>
            {loading && (
              <div className='flex justify-center items-center h-screen'>
                <SpinnerDotted
                  size={100}
                  thickness={100}
                  speed={100}
                  color='rgba(37, 107, 172, 1)'
                />
              </div>
            )}
            {bookNotFound && <p>Kein Buch gefunden</p>}
            {books.length > 0 && (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {books.map((book) => (
                  <div
                    key={book.isbn}
                    className='relative border p-4 rounded-md shadow-md flex flex-col items-center'
                  >
                    <img
                      src={book.book_image}
                      alt={book.title}
                      className='w-32 h-48 object-cover mt-2'
                      draggable='false'
                    />
                    <button
                      className='absolute top-2 right-2 text-red-500'
                      onClick={() => addToFavorites(book.isbn)}
                    >
                      <FontAwesomeIcon
                        icon={
                          favorites.includes(book.isbn)
                            ? faSolidHeart
                            : faRegularHeart
                        }
                        size='1x'
                      />
                    </button>
                    <h2 className='text-xl font-bold mt-2'>{book.title}</h2>
                    <p className='text-gray-700'>{book.author}</p>
                    <button
                      className='mt-2 bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-700'
                      onClick={() => navigate(`/book-reviews/${book.isbn}`)}
                    >
                      Watch Reviews
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className='w-full lg:w-1/3 p-4'>
            <TopReviewers />
            <BookList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
