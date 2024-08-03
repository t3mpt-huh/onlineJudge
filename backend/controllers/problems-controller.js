const Problem = require("../models/problemSchema");

// Add a new problem
const addProblem = async (req, res) => {
    try {
      const newProblem = new Problem(req.body);
      await newProblem.save();
      res.status(201).json(newProblem);
    } catch (error) {
      res.status(400).json({ message: 'Error adding problem', error });
    }
  };
  
  // Update an existing problem
  const updateProblem = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedProblem = await Problem.findByIdAndUpdate(id, req.body, { new: true });
      
      if (!updatedProblem) {
        return res.status(404).json({ message: 'Problem not found' });
      }
  
      res.status(200).json(updatedProblem);
    } catch (error) {
      res.status(400).json({ message: 'Error updating problem', error });
    }
  };
  
  // Delete a problem
  const deleteProblem = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedProblem = await Problem.findByIdAndDelete(id);
  
      if (!deletedProblem) {
        return res.status(404).json({ message: 'Problem not found' });
      }
  
      res.status(200).json({ message: 'Problem deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error deleting problem', error });
    }
  };
  
  // Get all problems
  const getProblems = async (req, res) => {
    try {
      const problems = await Problem.find();
      res.status(200).json(problems);
    } catch (error) {
      res.status(400).json({ message: 'Error retrieving problems', error });
    }
  };
  
  module.exports = {
    addProblem,
    updateProblem,
    deleteProblem,
    getProblems,
  };