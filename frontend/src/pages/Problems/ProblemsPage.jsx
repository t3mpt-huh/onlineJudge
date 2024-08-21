import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProblemsPage.css';

export const ProblemsPage = () => {
  const [problems, setProblems] = useState([]);

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

  return (
    <div className="problems-page">
      <h1 className="title">Problems</h1>
      <ul className="problems-list">
        {problems.map((problem) => (
          <li key={problem._id} className="problem-item">
            <Link to={`/problems/${problem._id}`} className="problem-link">
              {problem.problemName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
