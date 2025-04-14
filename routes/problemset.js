const express = require('express');
const router = express.Router();
const problemsetController = require('../controllers/problemset');

router.get('/', problemsetController.getPage);

module.exports = router;