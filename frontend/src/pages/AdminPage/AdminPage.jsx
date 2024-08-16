import React from 'react';
import './AdminPage.css';
import { Link } from 'react-router-dom';

export const AdminPage = () => {
  return (
    <div className="admin-container">
      <h1>Hmm, must be a close one to get access here!</h1>
      
      <div className="box-container">
        <Link to="/users" className="box-link">
          <div className="box">
            <h2>Manage Users</h2>
            <p>View and manage all registered users on the platform. You can edit, delete, or view detailed information about each user.</p>
          </div>
        </Link>
        <Link to="/addproblem" className="box-link">
          <div className="box">
            <h2>Add Problem</h2>
            <p>Create new problems for users to solve. You can specify the problem statement, input/output formats, and sample test cases.</p>
          </div>
        </Link>
        <Link to="/editproblem" className="box-link">
          <div className="box">
            <h2>Edit Problem</h2>
            <p>Modify existing problems. You can update problem details, add more test cases, or remove the problem entirely.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AdminPage;
