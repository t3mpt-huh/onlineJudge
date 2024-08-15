import React from 'react';
import './About.css'; // Ensure you have this CSS file for styling

export const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1>About Me</h1>
        <p>
          Welcome to my corner of the web! My name is Ansh Bansal, and as of August 2024, I am a pre-final year student at IIT Roorkee. Over the summer, I had the opportunity to dive into the world of software development through an externship at AlgoUniversity, where I honed my skills and gained valuable experience.
        </p>
        <div className="line-container">
          <hr className="line"/>
        </div>
        <h1>About This Website</h1>
        <p>
          This website is designed to be a resourceful platform featuring two main sections: the Compiler Page and the Problems Page.
        </p>
        <h2>Compiler Page</h2>
        <p>
          Here, users can compile and run code snippets in various programming languages. It’s an excellent tool for quick testing and debugging.
        </p>
        <h2>Problems Page</h2>
        <p>
          This section hosts a collection of coding problems ranging from easy to challenging. It’s ideal for those looking to practice and improve their problem-solving skills.
        </p>
        <h2>Admin Page</h2>
        <p>
          For those with administrative privileges, there is a dedicated Admin Page where you can manage the content on the site. You can add, edit, or delete problems and view all registered users. If you require admin access, please reach out to the website owner.
        </p>
      </div>
    </div>
  );
};

export default About;
