import React, { useEffect, useState } from "react";
import "./Footer.css";

export const Footer = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      console.log("scrollY:", window.scrollY);
      if (window.scrollY > 20) { // Adjust the value as needed
        setVisible(true);
      } else {
        setVisible(false);
      }
      console.log("visible:", visible);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [visible]);

  return (
    <footer className={visible ? "visible" : ""}>
      <p>© Copyright LetHimCode. No Rights Reserved</p>
    </footer>
  );
};
