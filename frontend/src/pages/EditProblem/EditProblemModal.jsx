import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditProblemModal.css';

export const EditProblemModal = ({ problem, onClose, onSave }) => {
  const [editedProblem, setEditedProblem] = useState({ ...problem });

  useEffect(() => {
    setEditedProblem({ ...problem });
  }, [problem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProblem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Updating problem with ID:", problem._id); // Debugging line
      const response = await axios.put(`${import.meta.env.VITE_RENDER_URL}/api/problems/updateProblem/${problem._id}`, editedProblem);
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating problem:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Problem</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Problem Name:
            <input
              type="text"
              name="problemName"
              value={editedProblem.problemName}
              onChange={handleChange}
            />
          </label>
          <label>
            Problem Description:
            <textarea
              name="problemDescription"
              value={editedProblem.problemDescription}
              onChange={handleChange}
            />
          </label>
          {/* Add other fields as necessary */}
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};
