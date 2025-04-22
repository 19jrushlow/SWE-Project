const express = require('express');
const router = express.Router();
const attemptManager = require('../controllers/attempts');

router.post('/saveAttempt', attemptManager.saveAttempt);
router.post('/loadAttempt', attemptManager.loadAttempt)

module.exports = router;