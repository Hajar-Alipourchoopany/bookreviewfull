import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import Logout from './Logout.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Sidebar = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { userData } = useAuth();

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (userData && userData.user.profileImageUrl) {
        setProfileImage(userData.user.profileImageUrl);
      }
    };

    fetchProfileImage();
  }, [userData]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleProfileImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      console.error('Keine Datei ausgewählt');
      return;
    }

    const formData = new FormData();
    formData.append('profileImageUrl', selectedFile);

    try {
      const response = await axios.post(
        `http://localhost:8000/api/${userData.user._id}/profile-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );
      setProfileImage(response.data.profileImageUrl);
    } catch (error) {
      console.error('Fehler beim Hochladen des Profilbilds:', error);
    }
  };

  return (
    <div className="sidebar">
      <div className="profile-section">
        {profileImage ? (
          <img src={profileImage} alt="Profilbild" className="profile-image" />
        ) : (
          <div className="profile-placeholder">Kein Profilbild</div>
        )}
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleProfileImageUpload}>Profilbild hochladen</button>
      </div>
      <h2>Navigation</h2>
      <ul>
        <li><Link to="/favorites">Favoriten</Link></li>
        <li><Link to="/my-reviews">Meine Reviews</Link></li>
      </ul>
      <Logout />
    </div>
  );
};

export default Sidebar;
