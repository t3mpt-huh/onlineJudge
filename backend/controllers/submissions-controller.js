const Submissions = require("../models/submissionsSchema");

// Controller to get all submissions
const getsubmissions = async (req, res) => {
    try {
      const submissions = await Submissions.find();  // Fetch all submissions from the database
      res.status(200).json(submissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      res.status(500).json({ message: 'Server Error: Unable to retrieve submissions' });
    }
  };
  
  // Controller to handle new code submissions
  const submit = async (req, res) => {
    console.log(req.body);
    const { userId, username, problemId, problemName, verdict, code, language, time} = req.body;
  
    // Validate required fields
    if (!userId || !username || !problemId || !problemName || !verdict || !code || !language || !time) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    try {
      // Create a new submission
      const newSubmission = new Submissions({
        userId,
        username,
        problemId,
        problemName,
        verdict,
        code,
        language,
        time
      });
  
      // Save the submission to the database
      const savedSubmission = await newSubmission.save();
      res.status(201).json(savedSubmission);
    } catch (error) {
      console.error('Error submitting code:', error);
      res.status(500).json({ message: 'Server Error: Unable to submit code.' });
    }
  };
  
  module.exports = {
    getsubmissions,
    submit
  };