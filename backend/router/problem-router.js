const express = require("express");
const router = express.Router();
const problemController = require("../controllers/problems-controller");

// Routes for problem management
router.post('/addProblem', problemController.addProblem);
router.put('/updateProblem/:id', problemController.updateProblem);
router.delete('/deleteProblem/:id', problemController.deleteProblem);
router.get('/getProblems', problemController.getProblems);


module.exports = router;