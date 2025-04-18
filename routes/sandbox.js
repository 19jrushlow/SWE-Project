const express = require('express');
const router = express.Router();
const problemController = require('../controllers/sandbox');
const IDEController = require('../controllers/IDE');

router.get('/sandbox', problemController.getPage);
router.get('/IDE', IDEController.getEditor);

module.exports = router;