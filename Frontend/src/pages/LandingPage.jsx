import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles
import { Carousel } from 'react-responsive-carousel';

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

  const renderTopBooks = () => (
    <Carousel
      showArrows={true}
      showThumbs={false}
      showStatus={false}
      infiniteLoop={true}
      autoPlay={true}
      interval={5000}
      centerMode={true}
      centerSlidePercentage={33.33}
      emulateTouch
    >
      {topBooks.map((book) => (
        <div key={book._id} className='p-4'>
          <div className='relative pb-[150%]'>
            <img
              src={book.book_image}
              alt={book.title}
              className='absolute top-0 left-0 w-full h-full object-cover rounded-md'
            />
          </div>
          <h3 className='text-lg font-semibold mb-1 text-center'>
            {book.title}
          </h3>
          <div className='my-12'></div>
        </div>
      ))}
    </Carousel>
  );

  const renderTopUsers = () => (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {topUsers.map((user) => (
        <div key={user._id} className='p-4 flex flex-col items-center'>
          <img
            src={user.profileImageUrl}
            alt={user.username}
            className='w-32 h-32 object-cover mb-4 rounded-full'
          />
          <h3 className='text-lg font-semibold mb-1 text-center'>
            {user.username}
          </h3>
        </div>
      ))}
    </div>
  );

  return (
    <div className='min-h-screen flex flex-col items-center bg-gray-100'>
      <div className='w-full max-w-4xl p-4'>
        <div className='text-center mb-12'>
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

        <div className='mb-12'>
          <h2 className='text-2xl font-semibold mb-6'>Top Bücher</h2>
          {renderTopBooks()}
        </div>

        <div>
          <h2 className='text-2xl font-semibold mb-6'>Top Users</h2>
          {renderTopUsers()}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
