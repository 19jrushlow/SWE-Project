const express = require('express');
const router = express.Router();
const progressTracker = require('../controllers/progresstracker');

router.post('/markProblem', progressTracker.markProblem);

module.exports = router;