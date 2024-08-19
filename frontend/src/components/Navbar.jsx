import { NavLink } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';
import { AuthContext } from './AuthContext';
import './Navbar.css';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const titleRef = useRef(null);

  useEffect(() => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let interval = null;

    const handleMouseOver = (event) => {
      let iteration = 0;
      clearInterval(interval);

      interval = setInterval(() => {
        event.target.innerText = event.target.innerText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return event.target.dataset.value[index];
            }
            return letters[Math.floor(Math.random() * 26)];
          })
          .join("");

        if (iteration >= event.target.dataset.value.length) {
          clearInterval(interval);
        }

        iteration += 1 / 3;
      }, 30);
    };

    const titleElement = titleRef.current;
    titleElement.dataset.value = titleElement.innerText;
    titleElement.addEventListener('mouseover', handleMouseOver);

    return () => {
      titleElement.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <header>
      <div className="nav">
        <div className="site-title">
          <NavLink to="/" ref={titleRef} className="animated-title">
            LetHimCode
          </NavLink>
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
              <NavLink to="/submissions">Submissions</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <NavLink to="/admin">Admin</NavLink>
            </li>
            {user ? (
              <li>
                <button className="logout-button" onClick={logout}>Logout</button>
              </li>
            ) : (
              <>
                <li>
                  <NavLink to="/register" className="green-button">Register</NavLink>
                </li>
                <li>
                  <NavLink to="/login" className="green-button">Login</NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
