import React, { useEffect } from 'react';
import './HomePage.css';

export const Home = () => {
  useEffect(() => {
    const menu = document.getElementById("menu");

    Array.from(document.getElementsByClassName("menu-item")).forEach((item, index) => {
      item.onmouseover = () => {
        menu.dataset.activeIndex = index;
      };
    });
  }, []);

  return (
    <div id="menu">
      <div id="menu-items">

        <div className="menu-item">Problems</div>
        <div className="menu-item">Compiler</div>
        <div className="menu-item">Submissions</div>
        <div className="menu-item">About</div>
        <div className="menu-item">Admin</div>
        
      </div>
      <div id="menu-background-pattern"></div>
      <div id="menu-background-image"></div>
    </div>
  );
};
