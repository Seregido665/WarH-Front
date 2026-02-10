import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeContext from '../contexts/themeContext';
import AuthContext from '../contexts/authContext';

const NavBar = () => {
  const { theme, handleChangeTheme } = useContext(ThemeContext)
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <nav className={`navbar navbar-expand-lg bg-${theme}`}>
        <div className="container-fluid">
          <a className={`navbar-brand text-${theme === 'light' ? 'dark' : 'light'}`} href="#">Navbar</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/store" className={`text-${theme === 'light' ? 'dark' : 'light'} nav-link`}>Store</Link>
              </li>
              {!isAuthenticated && (
                <>
                  <li className="nav-item">
                    <Link to="/login" className={`text-${theme === 'light' ? 'dark' : 'light'} nav-link`}>Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className={`text-${theme === 'light' ? 'dark' : 'light'} nav-link`}>Register</Link>
                  </li>
                </>
              )}
              {isAuthenticated && (
                <>
                  <li className="nav-item">
                    <Link to="/products/create" className={`text-${theme === 'light' ? 'dark' : 'light'} nav-link`}>Create Article</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/books" className={`text-${theme === 'light' ? 'dark' : 'light'} nav-link`}>Books</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/profile" className={`text-${theme === 'light' ? 'dark' : 'light'} nav-link`}>Profile</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div>
            {isAuthenticated && user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <h6 className={`text-${theme === 'light' ? 'dark' : 'light'} mb-0`}>
                  Hola: {user?.email}
                </h6>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleLogoutClick}
                >
                  Logout
                </button>
              </div>
            )}
            <button id="switch-theme" onClick={handleChangeTheme}>
              Change to: {theme === 'light' ? 'dark' : 'light'}
            </button>
          </div>
        </div >
      </nav >
    </div >
  );
};

export default NavBar;
