import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import MonacoEditor from "@monaco-editor/react";
import './Compiler.css'; 
// import PacmanLoader from "react-spinners/ClipLoader";

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

  // let [loading,setLoading] = usestate(true);

  const executeCode = async () => {
    const requestPayload = {
      language: "cpp",
      code: sourceCode,
      input: userInput,
    };

    try {
      const response = await axios.post("http://localhost:8080/compile", requestPayload);
      setResult(response.data.output);
    } catch (error) {
      alert("some error occured");
      console.error("An error occurred:", error);
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
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="input-area"
              placeholder="Enter your input here"
            />
          </div>
          <div className="execute-message">
            <span>Press execute to run your code</span>
            <button onClick={executeCode} className="execute-button">
              Execute
            </button>
            
            {/* <PacmanLoader
            color="#3c6e71"
            loading
            margin={2}
            size={15}
            />            */}
          </div>
          <div className="output-area-wrapper">
            <textarea
              placeholder="Output will appear here"
              value={result}
              className="output-area"
              readOnly
              
            />
          </div>
        </section>
      </div>
    </div>
  );
};
