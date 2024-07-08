import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
    <div className="flex flex-col items-center p-4 bg-gray-200 h-full">
      <div className="mb-4 text-center">
        {profileImage ? (
          <img src={profileImage} alt="Profilbild" className="w-32 h-32 rounded-full mb-2" />
        ) : (
          <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center mb-2">
            Kein Profilbild
          </div>
        )}
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-2"
        />
        <button
          onClick={handleProfileImageUpload}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        >
          Profilbild hochladen
        </button>
      </div>
      <h2 className="text-lg font-semibold mb-4">Navigation</h2>
      <ul className="nav-links mb-4">
        <li className="mb-2">
          <Link to="/favorites" className="text-blue-500 hover:underline">Favoriten</Link>
        </li>
        <li>
          <Link to="/my-reviews" className="text-blue-500 hover:underline">Meine Reviews</Link>
        </li>
      </ul>
      <Logout />
    </div>
  );
};

export default Sidebar;
