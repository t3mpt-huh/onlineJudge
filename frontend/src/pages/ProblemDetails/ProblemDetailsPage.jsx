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
    int a, b;
    cin >> a >> b;
    cout << "Sum is: " << (a + b) << endl;
    return 0;
}
  `);
  const [loading, setLoading] = useState(false);
  const [compileTime, setCompileTime] = useState(null);
  const [executeTime, setExecuteTime] = useState(null);
  const [language, setLanguage] = useState('cpp');
  const [verdicts, setVerdicts] = useState([]);
  const [isDelayed, setIsDelayed] = useState(false);
  const { problemId } = useParams();

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

  const executeTestCases = async (testCases, hidden = false) => {
    const results = [];
    for (let i = 0; i < testCases.length; i++) {
      const [input, expectedOutput] = testCases[i];
      console.log(`Running test case ${i + 1}:`, { input, expectedOutput });
  
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
            console.error(`Error parsing response data for test case ${i + 1}:`, error);
            results.push({ testCase: i + 1, verdict: 'Error' });
            continue;
          }
        }
  
        if (responseData && typeof responseData === 'object' && 'output' in responseData) {
          const { output: outputObj, compileTime: backendCompileTime, executeTime: backendExecuteTime } = responseData;
  
          setCompileTime(backendCompileTime !== undefined ? backendCompileTime : null);
          setExecuteTime(backendExecuteTime !== undefined ? backendExecuteTime : null);
  
          const finalOutput = outputObj.output;
  
          console.log(`Expected Output for test case ${i + 1}:`, expectedOutput.trim());
          console.log(`Actual Output for test case ${i + 1}:`, finalOutput.trim());
  
          if (finalOutput.trim() !== expectedOutput.trim()) {
            results.push({ testCase: i + 1, verdict: 'Fail' });
          } else {
            results.push({ testCase: i + 1, verdict: 'Pass' });
          }
        } else {
          console.error(`Unexpected response format for test case ${i + 1}:`, responseData);
          results.push({ testCase: i + 1, verdict: 'Error' });
        }
  
      } catch (error) {
        console.error(`Error executing ${hidden ? 'hidden ' : ''}test case ${i + 1}:`, error);
        results.push({ testCase: i + 1, verdict: 'Error' });
      }
    }
    setVerdicts(results);
    return results.every(result => result.verdict === 'Pass');
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

  const handleRun = async () => {
    setLoading(true);
    try {
      const sampleTestCases = problem.inputTests.map((input, index) => [input, problem.outputTests[index]]);
      const sampleTestsPassed = await executeTestCases(sampleTestCases);
      if (sampleTestsPassed) {
        toast.success("Sample test cases passed!");
      } else {
        toast.error("Sample test cases failed.");
      }
    } catch (error) {
      toast.error("An error occurred while running the sample test cases.");
      console.error("Run error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isDelayed) {
    return (
      <div className="loading-container">
        <ClimbingBoxLoader color="#3c6e71" size={30} />
        <p>Hold up, let the site cook...</p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="loading-container">
        <ClimbingBoxLoader color="#3c6e71" size={30} />
        <p>Hold up, let the site cook...</p>
      </div>
    );
  }

  return (
    <div className="problem-detail-container">
      <div className="problem-detail-left">
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
      </div>

      <div className="problem-detail-right">
        <div className="language-selector-container">
          <label htmlFor="language-selector">Select Language:</label>
          <select
            id="language-selector"
            className="language-selector"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
          </select>
        </div>
        <MonacoEditor
          height="calc(100vh - 250px)"
          language={language}
          value={sourceCode}
          onChange={(value) => setSourceCode(value)}
          theme="vs-dark"
        />
        <div className="button-container">
          <button className="run-button" onClick={handleRun} disabled={loading}>Run</button>
          <button className="submit-button" onClick={handleSubmit} disabled={loading}>Submit</button>
        </div>
        {loading && (
          <div className="loader-wrapper">
            <CircleLoader color="#3c6e71" size={40} />
          </div>
        )}
        <div className="verdicts-container">
          {verdicts.length > 0 && (
            <div>
              <h3>Verdicts:</h3>
              <ul>
                {verdicts.map((verdict, index) => (
                  <li key={index}>
                    Test Case {verdict.testCase}: {verdict.verdict}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
