import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddProblemPage.css'; // Assuming you've created the CSS file I provided earlier

export const AddProblemPage = () => {
  const [problem, setProblem] = useState({
    problemName: '',
    problemDescription: '',
    inputTests: [''],
    outputTests: [''],
    hiddenInputTests: [''],
    hiddenOutputTests: [''],
    inputDescription: '',
    outputDescription: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProblem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleArrayChange = (e, index, arrayName) => {
    const { value } = e.target;
    const updatedArray = [...problem[arrayName]];
    updatedArray[index] = value;
    setProblem((prevState) => ({
      ...prevState,
      [arrayName]: updatedArray,
    }));
  };

  const handleAddField = (arrayName, correspondingArrayName) => {
    setProblem((prevState) => {
      const updatedArray = [...prevState[arrayName], ''];
      const updatedCorrespondingArray = [...prevState[correspondingArrayName]];

      // Ensure the corresponding array also has the same number of fields
      if (updatedCorrespondingArray.length < updatedArray.length) {
        updatedCorrespondingArray.push('');
      }

      return {
        ...prevState,
        [arrayName]: updatedArray,
        [correspondingArrayName]: updatedCorrespondingArray,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { inputTests, outputTests, hiddenInputTests, hiddenOutputTests } = problem;

    // Enforce that each input test has a corresponding output test
    if (inputTests.length !== outputTests.length) {
      alert('Please ensure each input test has a corresponding output test.');
      return;
    }

    if (hiddenInputTests.length !== hiddenOutputTests.length) {
      alert('Please ensure each hidden input test has a corresponding hidden output test.');
      return;
    }

    try {
      console.log('Submitting problem:', problem); // Log problem data
      await axios.post(`${import.meta.env.VITE_RENDER_URL}/api/problems/addproblems`, problem);
      navigate('/problems');
    } catch (error) {
      if (error.response) {
        console.error('Error adding problem:', error.response.data); // Log server response
      } else if (error.request) {
        console.error('Error: No response received', error.request); // Log if no response was received
      } else {
        console.error('Error:', error.message); // Log any other error messages
      }
    }
  };

  return (
    <div className="add-problem-container">
      <h1>Add Problem</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Problem Name:
          <input type="text" name="problemName" value={problem.problemName} onChange={handleChange} />
        </label>
        <label>
          Problem Description:
          <textarea name="problemDescription" value={problem.problemDescription} onChange={handleChange} />
        </label>
        <label>
          Input Description:
          <textarea name="inputDescription" value={problem.inputDescription} onChange={handleChange} />
        </label>
        <label>
          Output Description:
          <textarea name="outputDescription" value={problem.outputDescription} onChange={handleChange} />
        </label>

        <h3 className="section-title">Input Tests</h3>
        {problem.inputTests.map((test, index) => (
          <input
            key={index}
            type="text"
            value={test}
            onChange={(e) => handleArrayChange(e, index, 'inputTests')}
          />
        ))}
        <button type="button" onClick={() => handleAddField('inputTests', 'outputTests')}>Add Input Test</button>

        <h3 className="section-title">Output Tests</h3>
        {problem.outputTests.map((test, index) => (
          <input
            key={index}
            type="text"
            value={test}
            onChange={(e) => handleArrayChange(e, index, 'outputTests')}
          />
        ))}
        <button type="button" onClick={() => handleAddField('outputTests', 'inputTests')}>Add Output Test</button>

        <h3 className="section-title">Hidden Input Tests</h3>
        {problem.hiddenInputTests.map((test, index) => (
          <input
            key={index}
            type="text"
            value={test}
            onChange={(e) => handleArrayChange(e, index, 'hiddenInputTests')}
          />
        ))}
        <button type="button" onClick={() => handleAddField('hiddenInputTests', 'hiddenOutputTests')}>Add Hidden Input Test</button>

        <h3 className="section-title">Hidden Output Tests</h3>
        {problem.hiddenOutputTests.map((test, index) => (
          <input
            key={index}
            type="text"
            value={test}
            onChange={(e) => handleArrayChange(e, index, 'hiddenOutputTests')}
          />
        ))}
        <button type="button" onClick={() => handleAddField('hiddenOutputTests', 'hiddenInputTests')}>Add Hidden Output Test</button>

        <button type="submit">Add Problem</button>
      </form>
    </div>
  );
};

export default AddProblemPage;
