import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { EditProblemModal } from './EditProblemModal'; // Ensure this is the path to your modal component
import './EditProblemPage.css'; // Create this CSS file for styling

export const EditProblemPage = () => {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_RENDER_URL}/api/problems/getproblems`);
        setProblems(response.data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    fetchProblems();
  }, []);

  const handleEditClick = (problem) => {
    setSelectedProblem(problem);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_RENDER_URL}/api/problems/deleteProblem/${id}`);
      setProblems(problems.filter((problem) => problem._id !== id));
    } catch (error) {
      console.error('Error deleting problem:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProblem(null);
  };

  const handleModalSave = (updatedProblem) => {
    setProblems(problems.map((problem) =>
      problem._id === updatedProblem._id ? updatedProblem : problem
    ));
    handleModalClose();
  };

  return (
    <div className="edit-problems-page">
      <h1>Edit Problems</h1>
      <table>
        <thead>
          <tr>
            <th>Problem Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr key={problem._id}>
              <td>{problem.problemName}</td>
              <td>
                <button onClick={() => handleEditClick(problem)}>Edit</button>
                <button onClick={() => handleDeleteClick(problem._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <EditProblemModal
          problem={selectedProblem}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};


