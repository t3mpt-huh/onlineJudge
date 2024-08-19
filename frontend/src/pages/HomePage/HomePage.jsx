import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import './HomePage.css';

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const Home = () => {
  const linksRef = useRef([]);

  useEffect(() => {
    linksRef.current.forEach((linkElement) => {
      const handleMouseOver = (event) => {
        let iteration = 0;
        clearInterval(linkElement.interval);
        linkElement.dataset.value = linkElement.innerText;

        linkElement.interval = setInterval(() => {
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
            clearInterval(linkElement.interval);
          }

          iteration += 1 / 3;
        }, 30);
      };

      linkElement.addEventListener('mouseover', handleMouseOver);

      return () => {
        linkElement.removeEventListener('mouseover', handleMouseOver);
      };
    });
  }, []);

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to LetHimCode</h1>
      <div className="links-container">
        {[
          { path: '/register', label: 'Register' },
          { path: '/login', label: 'Login' },
          { path: '/compiler', label: 'Compiler' },
          { path: '/problems', label: 'Problems' },
          { path: '/admin', label: 'Admin' },
          { path: '/addproblem', label: 'Add Problem' },
          { path: '/editproblem', label: 'Edit Problem' }
        ].map((link, index) => (
          <NavLink
            key={link.path}
            to={link.path}
            className="animated-link"
            ref={(el) => linksRef.current[index] = el}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

// export default {HomeP};
