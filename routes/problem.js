const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problem');

router.get('/problem', problemController.getPage);
router.get('/problems.json', problemController.getProblems)

module.exports = router;