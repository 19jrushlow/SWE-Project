const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboard');

router.get('/leaderboard', leaderboardController.getPage);
router.post('/api/leaderboard/getLeaders', leaderboardController.getLeaders);

module.exports = router;