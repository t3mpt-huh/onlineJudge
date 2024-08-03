import React, { useState } from "react";
import axios from "axios";
import MonacoEditor from "@monaco-editor/react";
import CircleLoader from "react-spinners/CircleLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import './Compiler.css'; 

export const Compiler = () => {
  const initialCode =
`#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "keep grinding o7";

    return 0;
}`;

  const [sourceCode, setSourceCode] = useState(initialCode);
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState("");
  const [compileTime, setCompileTime] = useState(null);
  const [executeTime, setExecuteTime] = useState(null);
  const [loading, setLoading] = useState(false);

  const executeCode = async () => {
    setLoading(true);
    const requestPayload = {
      language: "cpp",
      code: sourceCode,
      input: userInput,
    };
  
    try {
      const response = await axios.post("http://localhost:8080/compile", requestPayload);
      // Extract output, compileTime, and executeTime from the response data
      const { output, compileTime, executeTime } = response.data;
  
      // Set state values
      setResult(output || ""); // Ensure output is a string
      setCompileTime(compileTime ?? 0); // Default to 0 if compileTime is undefined
      setExecuteTime(executeTime ?? 0); // Default to 0 if executeTime is undefined
  
      toast.success("Code executed successfully!");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setResult(error.response.data.message);
      } else {
        setResult("An unknown error occurred.");
      }
      toast.error("An error occurred while executing the code.");
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="compiler-container">
      <div className="header">
        Online Compiler
      </div>
      <div className="main-content">
        <section className="editor-section">
          <MonacoEditor
            value={sourceCode}
            onChange={(newValue) => setSourceCode(newValue)}
            className="editor"
            height="100%" /* Fit to the remaining height */
            theme="vs-dark"
            width="100%"
            options={{
              fontSize: 16,
            }}
            defaultLanguage="cpp"
          />
        </section>
        <section className="result-section">
          <div className="input-area-wrapper">
            <textarea
              style={{ resize: 'none', overflow: 'auto'}}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="input-area"
              placeholder="Enter your input here"
            />
          </div>
          <div className="execute-container">
            <span className="execute-message">Run your code</span>
            <button onClick={executeCode} className="execute-button" disabled={loading}>
              Execute   
            </button>
            {loading && (
              <div className="loader-wrapper">
                <CircleLoader size={25} color={"#fff"} loading={loading} />
              </div>
            )}
          </div>
          <div className="output-area-wrapper">
  <textarea
    style={{ resize: 'none' , overflow: 'auto'}}
    placeholder="Output will appear here"
    value={result}
    className="output-area"
    readOnly
  />
  {(compileTime !== null && executeTime !== null) && (
    <div className="time-info">
      <p><strong>Compilation Time:</strong> {compileTime.toFixed(2)} ms</p>
      <p><strong>Execution Time:</strong> {executeTime.toFixed(2)} ms</p>
    </div>
  )}
</div>
        </section>
      </div>
      <ToastContainer 
        position="bottom-right" 
        theme="dark"
      />
    </div>
  );
};
