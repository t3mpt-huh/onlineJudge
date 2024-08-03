import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';
import CircleLoader from 'react-spinners/CircleLoader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './ProblemDetailsPage.css';

export const ProblemDetailPage = () => {
  const [problem, setProblem] = useState(null);
  const [sourceCode, setSourceCode] = useState('');
  const [loading, setLoading] = useState(false);
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

  const executeTestCases = async (testCases, hidden = false) => {
    for (let i = 0; i < testCases.length; i++) {
      const [input, expectedOutput] = testCases[i];
      const requestPayload = {
        language: "cpp",
        code: sourceCode,
        input: input,
      };

      try {
        const response = await axios.post("http://localhost:8080/compile", requestPayload);
        if (response.data.output.trim() !== expectedOutput.trim()) {
          return false;
        }
      } catch (error) {
        console.error(`Error executing ${hidden ? 'hidden ' : ''}test case ${i + 1}:`, error);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const sampleTestCases = problem.inputTests.map((input, index) => [input, problem.outputTests[index]]);
      const hiddenTestCases = problem.hiddenInputTests.map((input, index) => [input, problem.hiddenOutputTests[index]]);

      const sampleTestsPassed = await executeTestCases(sampleTestCases);
      if (!sampleTestsPassed) {
        toast.error("Sample test cases failed.");
        setLoading(false);
        return;
      }

      const hiddenTestsPassed = await executeTestCases(hiddenTestCases, true);
      if (hiddenTestsPassed) {
        toast.success("All test cases passed! Problem solved!");
      } else {
        toast.error("One or more hidden test cases failed.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the code.");
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!problem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="problem-detail-container">
      <div className="problem-detail-left">
        <h1>{problem.problemName}</h1>
        <p><strong>Description:</strong> {problem.problemDescription}</p>
        <p><strong>Input Description:</strong> {problem.inputDescription}</p>
        <p><strong>Output Description:</strong> {problem.outputDescription}</p>
        <h3>Sample Tests:</h3>
        {problem.inputTests.map((inputTest, index) => (
          <div key={index}>
            <p><strong>Sample Input {index + 1}:</strong> {inputTest}</p>
            <p><strong>Sample Output {index + 1}:</strong> {problem.outputTests[index]}</p>
          </div>
        ))}
        <button onClick={handleSubmit} className="submit-button" disabled={loading}>
          Submit
          {loading && (
            <div className="loader-wrapper">
              <CircleLoader size={25} color={"#fff"} loading={loading} />
            </div>
          )}
        </button>
      </div>
      <div className="problem-detail-right">
        <MonacoEditor
          value={sourceCode}
          onChange={(newValue) => setSourceCode(newValue)}
          className="editor"
          height="90vh"
          theme="vs-dark"
          width="100%"
          options={{
            fontSize: 16,
          }}
          defaultLanguage="cpp"
        />
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default ProblemDetailPage;
