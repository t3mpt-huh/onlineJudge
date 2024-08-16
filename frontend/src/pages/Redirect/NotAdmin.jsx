// NotAdmin.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './NotAdmin.css'; // Assuming you want to add custom styles

export const NotAdmin = () => {
  return (
    <div className="not-admin-container">
      <h1>Access Denied</h1>
      <p>You do not have the required permissions to access this page.</p>
      <p>
        If you believe you should have access, please <Link to="/login">log in</Link> with an admin account.
      </p>
      <p>
        If you need admin access, please contact the owner of the site to request it.
      </p>
    </div>
  );
};

// export default NotAdmin;
