import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BookAdd.css';

const BookAdd = ({ isbn }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [bookImage, setBookImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('isbn', isbn);
    formData.append('title', title);
    formData.append('author', author);
    formData.append('book_image', bookImage);

    try {
      await axios.post('http://localhost:8000/api/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate(`/book-reviews/${isbn}`);
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Buches:', error);
    }
  };

  return (
    <div className="book-add">
      <h2>Neues Buch hinzufügen</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ISBN:</label>
          <input type="text" value={isbn} readOnly />
        </div>
        <div>
          <label>Titel:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Autor:</label>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        </div>
        <div>
          <label>Buchbild:</label>
          <input type="file" onChange={(e) => setBookImage(e.target.files[0])} required />
        </div>
        <button type="submit">Buch hinzufügen</button>
      </form>
    </div>
  );
};

export default BookAdd;
