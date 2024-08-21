import React, { useState } from "react";
import axios from "axios";
import MonacoEditor from "@monaco-editor/react";
import CircleLoader from "react-spinners/CircleLoader";
import './Compiler.css';

export const Compiler = () => {
  const initialCppCode = `#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "keep grinding o7";

    return 0;
}`;

  const initialPythonCode = `print("keep grinding o7")`;

  const [language, setLanguage] = useState("cpp");
  const [sourceCode, setSourceCode] = useState(initialCppCode);
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState("");
  const [compileTime, setCompileTime] = useState(null);
  const [executeTime, setExecuteTime] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    if (selectedLanguage === "cpp") {
      setSourceCode(initialCppCode);
    } else if (selectedLanguage === "python") {
      setSourceCode(initialPythonCode);
    }
  };

  const executeCode = async () => {
    setLoading(true);
    const requestPayload = {
      language,
      code: sourceCode,
      input: userInput,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_AWS_URL}/compile`, requestPayload);
      const { output } = response.data;

      // Extract values from the nested output object
      const { output: result, compileTime, executeTime } = output;

      // Set state values
      setResult(result || ""); // Ensure output is a string
      setCompileTime(compileTime ?? 0); // Default to 0 if compileTime is undefined
      setExecuteTime(executeTime ?? 0); // Default to 0 if executeTime is undefined
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        const filteredError = error.response.data.error.split('\n').slice(1).join('\n');
        setResult(filteredError);
      } else {
        setResult("An unknown error occurred.");
      }
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
          <div className="language-selector">
            <label htmlFor="language">Select Language: </label>
            <select id="language" value={language} onChange={handleLanguageChange}>
              <option value="cpp">C++</option>
              <option value="python">Python</option>
            </select>
          </div>
          <MonacoEditor
            value={sourceCode}
            onChange={(newValue) => setSourceCode(newValue)}
            className="editor"
            height="100%"
            theme="vs-dark"
            width="100%"
            options={{
              fontSize: 16,
            }}
            defaultLanguage={language}
          />
        </section>
        <section className="result-section">
          <div className="input-area-wrapper">
            <textarea
              style={{ resize: 'none', overflow: 'auto' }}
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
              style={{ resize: 'none', overflow: 'auto' }}
              placeholder="Output will appear here"
              value={result}
              className={`output-area ${String(result).includes("error") ? "error" : ""}`}
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
    </div>
  );
};
