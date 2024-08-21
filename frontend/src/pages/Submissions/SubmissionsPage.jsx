import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import './SubmissionsPage.css';

const PAGE_SIZE = 10;

export const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_RENDER_URL}/api/submissions/getsubmissions`);
        setSubmissions(response.data.reverse());  // to reverse the data
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    fetchSubmissions();
  }, []);

  const totalPages = Math.ceil(submissions.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentSubmissions = submissions.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openModal = (code) => {
    setSelectedCode(code);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCode('');
  };

  return (
    <div className="submissions-page">
      <h1 className="page-title">Submissions</h1>
      <table className="submissions-table">
        <thead>
          <tr>
            {/* <th>User ID</th> */}
            <th>Username</th>
            {/* <th>Problem ID</th> */}
            <th>Problem Name</th>
            <th>Verdict</th>
            <th>Code</th>
            <th>Language</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {currentSubmissions.map((submission, index) => (
            <tr key={index}>
              {/* <td>{submission.userId}</td> */}
              <td>{submission.username}</td>
              {/* <td>{submission.problemId}</td> */}
              <td>{submission.problemName}</td>
              <td>{submission.verdict.join(', ')}</td>
              <td>
                <button
                  className="view-code-button"
                  onClick={() => openModal(submission.code)}
                >
                View Code
                </button>
              </td>
              <td>{submission.language}</td>
              <td>{submission.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages+1 }, (_, i) => (
          <button
            key={i + 1}
            className={`page-button ${currentPage === i + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} code={selectedCode} />
    </div>
  );
};

export default SubmissionsPage;
