const express = require('express');
const router = express.Router();
const progressTracker = require('../controllers/search');

router.post('/findProblems', progressTracker.findProblems);
router.get('/getDifficulties', progressTracker.getDifficulties);
router.get('/getCategories', progressTracker.getCategories);

module.exports = router;