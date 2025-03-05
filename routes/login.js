const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login');

router.get('/', loginController.getLogin);
router.post('/', loginController.postLogin);

module.exports = router