import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import './Navbar.css';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header>
      <div className="nav">
        <div className="site-title">
          <NavLink to="/">LetHimCode</NavLink>
        </div>
        <nav>
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/compiler">Compiler</NavLink>
            </li>
            <li>
              <NavLink to="/problems">Problems</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            {user ? (
              <li>
                <button className="logout-button" onClick={logout}>Logout</button>
              </li>
            ) : (
              <>
                <li>
                  <NavLink to="/register">Register</NavLink>
                </li>
                <li>
                  <NavLink to="/login">Login</NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
