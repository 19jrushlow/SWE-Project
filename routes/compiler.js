const express = require('express');
const router = express.Router();
const compiler = require('../controllers/compiler');

router.post('/runCode', compiler.runCode);

module.exports = router;