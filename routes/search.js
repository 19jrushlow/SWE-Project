const express = require('express');
const router = express.Router();
const progressTracker = require('../controllers/search');

router.post('/findProblems', progressTracker.findProblems);

module.exports = router;