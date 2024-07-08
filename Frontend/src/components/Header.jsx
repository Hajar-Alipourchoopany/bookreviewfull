import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Header.css';

const Header = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate('/main');
    } else {
      navigate('/');
    }
  };

  return (
    <header className="header">
      <div className="logo" onClick={handleLogoClick}>
        PBR
      </div>
      <nav>
        <ul>
          <li><Link to="/about-us">About Us</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
