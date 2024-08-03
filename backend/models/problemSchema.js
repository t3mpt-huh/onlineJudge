const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid'); // Import uuid for generating unique IDs

const problemSchema = new mongoose.Schema({
  // _id: {
  //   type: String,
  //   default: uuidv4, // Automatically generate a unique ID
  // },
  problemName: {
    type: String,
    required: true,
  },
  problemDescription: {
    type: String,
    required: true,
  },
  inputTests: {
    type: [String],
    required: true,
  },
  outputTests: {
    type: [String],
    required: true,
  },
  hiddenInputTests: {
    type: [String],
    required: true,
  },
  hiddenOutputTests: {
    type: [String],
    required: true,
  },
  inputDescription: {
    type: String,
    required: true,
  },
  outputDescription: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Problem', problemSchema);
