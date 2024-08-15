import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';
import CircleLoader from 'react-spinners/CircleLoader';
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './ProblemDetailsPage.css';

export const ProblemDetailPage = () => {
  const [problem, setProblem] = useState(null);
  const [sourceCode, setSourceCode] = useState(`
// Sample C++ Code
#include <iostream>
using namespace std;

int main() {
    cout<<"cook here";
    return 0;
}
  `);
  const [loading, setLoading] = useState(false);
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [executeLoading, setExecuteLoading] = useState(false);
  const [compileTime, setCompileTime] = useState(null);
  const [executeTime, setExecuteTime] = useState(null);
  const [language, setLanguage] = useState('cpp');
  const [verdicts, setVerdicts] = useState([]);
  const [isDelayed, setIsDelayed] = useState(false);
  const { problemId } = useParams();
  const [userInput, setUserInput] = useState('');
  const [userOutput, setUserOutput] = useState('');

  useEffect(() => {
    const simulateLoadingDelay = () => {
      setTimeout(() => {
        setIsDelayed(true);
      }, 3000);
    };

    const fetchProblem = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/problems/getProblems');
        const problems = response.data;
        const foundProblem = problems.find(p => p._id === problemId);
        setProblem(foundProblem);
      } catch (error) {
        console.error('Error fetching problem details:', error);
      }
    };

    simulateLoadingDelay();
    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    const handleMouseDown = (e) => {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
      const container = document.querySelector('.problem-detail-container');
      const left = document.querySelector('.problem-detail-left');
      const right = document.querySelector('.problem-detail-right');
      const third = document.querySelector('.problem-detail-third');

      const containerWidth = container.getBoundingClientRect().width;
      const offsetX = e.clientX / containerWidth;

      left.style.flex = offsetX;
      right.style.flex = 1 - offsetX / 2;
      third.style.flex = 1 - offsetX / 2;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const resizers = document.querySelectorAll('.resizer');
    resizers.forEach(resizer => {
      resizer.addEventListener('mousedown', handleMouseDown);
    });

    return () => {
      resizers.forEach(resizer => {
        resizer.removeEventListener('mousedown', handleMouseDown);
      });
    };
  }, []);

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    
    if (selectedLanguage === 'cpp') {
      setSourceCode(`
// Sample C++ Code
#include <iostream>
using namespace std;

int main() {
    cout<<"cook here";
    return 0;
}
      `);
    } else if (selectedLanguage === 'python') {
      setSourceCode(`
# Sample Python Code
print('hello world')
      `);
    }
  };

  const executeTestCases = async (testCases, isHidden = false) => {
    const results = [];
    
    for (let i = 0; i < testCases.length; i++) {
      const [input, expectedOutput] = testCases[i];
      console.log(`Running ${isHidden ? 'hidden ' : ''}test case ${i + 1}:`, { input, expectedOutput });
  
      const requestPayload = {
        language: language,
        code: sourceCode,
        input: input,
      };
  
      try {
        const response = await axios.post("http://localhost:8080/compile", requestPayload);
  
        let responseData = response.data;
        if (typeof responseData === 'string') {
          try {
            responseData = JSON.parse(responseData);
          } catch (error) {
            console.error(`Error parsing response data for ${isHidden ? 'hidden ' : ''}test case ${i + 1}:`, error);
            results.push({ testCase: `${isHidden ? 'Hidden' : 'Sample'} Test Case ${i + 1}`, verdict: 'Error' });
            continue;
          }
        }
  
        if (responseData && typeof responseData === 'object' && 'output' in responseData) {
          const { output: outputObj, compileTime: backendCompileTime, executeTime: backendExecuteTime } = responseData;
  
          setCompileTime(backendCompileTime !== undefined ? backendCompileTime : null);
          setExecuteTime(backendExecuteTime !== undefined ? backendExecuteTime : null);
  
          const finalOutput = outputObj.output.trim();
  
          console.log(`Expected Output for ${isHidden ? 'hidden ' : ''}test case ${i + 1}:`, expectedOutput.trim());
          console.log(`Actual Output for ${isHidden ? 'hidden ' : ''}test case ${i + 1}:`, finalOutput);
  
          if (finalOutput !== expectedOutput.trim()) {
            results.push({ testCase: `${isHidden ? 'Hidden' : 'Sample'} Test Case ${i + 1}`, verdict: 'Failed' });
          } else {
            results.push({ testCase: `${isHidden ? 'Hidden' : 'Sample'} Test Case ${i + 1}`, verdict: 'Passed' });
          }
        } else {
          console.error(`Unexpected response format for ${isHidden ? 'hidden ' : ''}test case ${i + 1}:`, responseData);
          results.push({ testCase: `${isHidden ? 'Hidden' : 'Sample'} Test Case ${i + 1}`, verdict: 'Error' });
        }
  
      } catch (error) {
        console.error(`Error executing ${isHidden ? 'hidden ' : ''}test case ${i + 1}:`, error);
        results.push({ testCase: `${isHidden ? 'Hidden' : 'Sample'} Test Case ${i + 1}`, verdict: 'Error' });
      }
    }
  
    // Set the full verdict results array
    setVerdicts(results);
  
    // Return the full array of results for further processing
    return results;
  };
  
  

  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      // Prepare sample and hidden test cases
      const sampleTestCases = problem.inputTests.map((input, index) => [input, problem.outputTests[index]]);
      const hiddenTestCases = problem.hiddenInputTests.map((input, index) => [input, problem.hiddenOutputTests[index]]);
  
      // Execute sample and hidden test cases and retrieve the results
      const sampleTestsResults = await executeTestCases(sampleTestCases);
      const hiddenTestsResults = await executeTestCases(hiddenTestCases, true);
  
      // Combine sample and hidden test results into a single array
      const allTestResults = [...sampleTestsResults, ...hiddenTestsResults];
  
      // Display verdicts for both sample and hidden test cases
      setVerdicts(allTestResults);
  
      // Check for pass/fail statuses and show toast notifications
      const sampleTestsPassed = sampleTestsResults.every(result => result.verdict === 'Passed');
      const hiddenTestsPassed = hiddenTestsResults.every(result => result.verdict === 'Passed');
  
      if (!sampleTestsPassed) {
        toast.error("Some sample test cases failed.");
      } else {
        toast.success("All sample test cases passed!");
      }
  
      if (!hiddenTestsPassed) {
        toast.error("One or more hidden test cases failed.");
      } else if (sampleTestsPassed && hiddenTestsPassed) {
        toast.success("All test cases passed! Problem solved!");
      }
  
    } catch (error) {
      toast.error("An error occurred while submitting the code.");
      console.error("Submission error:", error);
    } finally {
      setSubmitLoading(false);
    }
  };
  
  
  
  const handleRun = async () => {
    setRunLoading(true);
    try {
      // Construct test cases from problem input and output
      const sampleTestCases = problem.inputTests.map((input, index) => [input, problem.outputTests[index]]);
      
      // Execute the test cases
      const results = await executeTestCases(sampleTestCases);
      
      // Check if all test cases passed
      const allPassed = results.every(result => result.verdict === 'Passed');
      
      if (allPassed) {
        toast.success("Sample test cases passed!");
      } else {
        toast.error("Sample test cases failed.");
      }
      
      // Optionally log results for debugging
      console.log("Test case results:", results);
    } catch (error) {
      toast.error("An error occurred while running the sample test cases.");
      console.error("Run error:", error);
    } finally {
      setRunLoading(false);
    }
  };
  

  const handleExecute = async () => {
    setExecuteLoading(true);
    try {
      const requestPayload = {
        language: language,
        code: sourceCode,
        input: userInput,
      };
      const response = await axios.post("http://localhost:8080/compile", requestPayload);
  
      let responseData = response.data;
      if (typeof responseData === 'string') {
        try {
          responseData = JSON.parse(responseData);
        } catch (error) {
          console.error(`Error parsing response data:`, error);
          setUserOutput('Error');
          return;
        }
      }
  
      if (responseData && typeof responseData === 'object' && 'output' in responseData) {
        const { output: outputObj } = responseData;
        const finalOutput = outputObj.output;
        setUserOutput(finalOutput);
      } else {
        console.error(`Unexpected response format:`, responseData);
        setUserOutput('Error');
      }
    } catch (error) {
      console.error("Execution error:", error);
      setUserOutput('Error');
    } finally {
      setExecuteLoading(false);
    }
  };

  return (
    <div className="problem-detail-container">
      <div className="problem-detail-left">
        {problem ? (
          <>
            <h1 className="problem-name">{problem.problemName}</h1>
            <div className="detail-box problem-description">
              <p><strong>Description:</strong></p>
              <p>{problem.problemDescription}</p>
            </div>
            <div className="detail-box problem-input-description">
              <p><strong>Input Description:</strong></p>
              <p>{problem.inputDescription}</p>
            </div>
            <div className="detail-box problem-output-description">
              <p><strong>Output Description:</strong></p>
              <p>{problem.outputDescription}</p>
            </div>
            <div className="sample-tests-container">
              <h3>Sample Tests:</h3>
              {problem.inputTests.map((inputTest, index) => (
                <div key={index} className="sample-test-container">
                  <div className="input-output-box">
                    <h4>Sample Input Test Case {index + 1}:</h4>
                    <p className="input-output-value">{inputTest}</p>
                  </div>
                  <div className="input-output-box">
                    <h4>Sample Output Test Case {index + 1}:</h4>
                    <p className="input-output-value">{problem.outputTests[index]}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="loading-container">
            {isDelayed ? (
              <CircleLoader color="#007bff" loading={loading} size={100} />
            ) : (
              <p>Loading problem...</p>
            )}
          </div>
        )}
      </div>
  
      <div className="problem-detail-right">
        <div className="editor-header">
          <select value={language} onChange={handleLanguageChange}>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
          </select>
          <button onClick={handleRun} disabled={runLoading} className="button">
            <div className="button-content">
              {runLoading ? <CircleLoader color="#fff" loading={runLoading} size={10} className="loader" /> : 'Run'}
            </div>
          </button>
  
          <button onClick={handleSubmit} disabled={submitLoading} className="button">
            <div className="button-content">
              {submitLoading ? (
                <CircleLoader color="#fff" loading={submitLoading} size={10} className="loader" />
              ) : 'Submit'}
            </div>
          </button>
        </div>
        <MonacoEditor
          height="50vh"
          language={language}
          value={sourceCode}
          onChange={setSourceCode}
          theme="vs-dark"
        />
        <div className="verdict-list">
          <h3>Verdicts</h3>
          <ul>
            {verdicts.map((verdict, index) => (
              <li
                key={index}
                className={
                  verdict.verdict === 'Passed' ? 'pass' :
                  verdict.verdict === 'Failed' ? 'fail' :
                  verdict.verdict === 'Error' ? 'error' :
                  ''  // Default case if verdict is none of the above
                }
              >
                {verdict.testCase}: {verdict.verdict}
              </li>
            ))}
          </ul>
        </div>
      </div>
  
      <div className="problem-detail-third">
        <h3>Try for Custom Input</h3>
        <textarea
          placeholder="Enter custom input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button onClick={handleExecute} disabled={executeLoading}>
          {executeLoading ? <CircleLoader color="#fff" loading={executeLoading} size={15} /> : 'Execute'}
        </button>
        <h3>Output</h3>
        <textarea readOnly placeholder="Output will appear here" value={userOutput} />
      </div>
      <ToastContainer />
    </div>
  );
  
};
