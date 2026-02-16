import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/authContext';
import "../styles/nabvar.css";

const NavBar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/store" className="text-dark nav-link">Store</Link>
              </li>
              {!isAuthenticated && (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="text-dark nav-link">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="text-dark nav-link">Register</Link>
                  </li>
                </>
              )}
              {isAuthenticated && (
                <>
                  <li className="nav-item">
                    <Link to="/products/create" className="text-dark nav-link">Create Article</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/profile" className="text-dark nav-link">Profile</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div>
            {isAuthenticated && user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleLogoutClick}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div >
      </nav >
    </div >
  );
};

export default NavBar;
