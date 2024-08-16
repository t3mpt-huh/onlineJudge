// NotSignedIn.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './NotSignedIn.css'; // Assuming you want to add custom styles

export const NotSignedIn = () => {
  return (
    <div className="not-signed-in-container">
      <h1>Access Denied</h1>
      <p>You need to be signed in to access this page.</p>
      <p>
        Please <Link to="/register">register</Link> or <Link to="/login">log in</Link> to continue.
      </p>
    </div>
  );
};

// export default NotSignedIn;
