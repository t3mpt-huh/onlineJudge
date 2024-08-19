const express = require("express");
const router = express.Router();

const submissionsController = require("../controllers/submissions-controller");

router.get('/getsubmissions', submissionsController.getsubmissions);
router.post('/submit', submissionsController.submit);
module.exports = router;