const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login');

router.get('/login', loginController.getLogin);
router.post('/postLogin', loginController.postLogin);

module.exports = router