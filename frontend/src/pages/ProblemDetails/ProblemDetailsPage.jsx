import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export const ProblemDetailPage = () => {
  const [problem, setProblem] = useState(null);
  const { problemId } = useParams();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/problems/getProblems');
        const problems = response.data;

        // Find the problem with the matching ID
        const foundProblem = problems.find(p => p._id === problemId);
        setProblem(foundProblem);
      } catch (error) {
        console.error('Error fetching problem details:', error);
      }
    };

    fetchProblem();
  }, [problemId]);

  if (!problem) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{problem.problemName}</h1>
      <p><strong>Description:</strong> {problem.problemDescription}</p>
      <p><strong>Input Description:</strong> {problem.inputDescription}</p>
      <p><strong>Output Description:</strong> {problem.outputDescription}</p>
      <h3>Input Tests:</h3>
      <ul>
        {problem.inputTests.map((test, index) => (
          <li key={index}>{test}</li>
        ))}
      </ul>
      <h3>Output Tests:</h3>
      <ul>
        {problem.outputTests.map((test, index) => (
          <li key={index}>{test}</li>
        ))}
      </ul>
      <h3>Hidden Input Tests:</h3>
      <ul>
        {problem.hiddenInputTests.map((test, index) => (
          <li key={index}>{test}</li>
        ))}
      </ul>
      <h3>Hidden Output Tests:</h3>
      <ul>
        {problem.hiddenOutputTests.map((test, index) => (
          <li key={index}>{test}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProblemDetailPage;
