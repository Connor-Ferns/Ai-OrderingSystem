import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Ordering System</Link>
        <div className="navbar-nav ms-auto">
          {user.username ? (
            <>
              <Link className="nav-link" to="/">Home</Link>
              <Link className="nav-link" to="/inventory">Inventory</Link>
              {isAdmin && (
                <div className="dropdown">
                  <button 
                    className="btn btn-secondary dropdown-toggle" 
                    type="button" 
                    data-bs-toggle="dropdown"
                  >
                    Admin
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/admin/users">
                        Manage Users
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/admin/settings">
                        Settings
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
              <button 
                className="btn btn-danger ms-2" 
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link className="nav-link" to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 