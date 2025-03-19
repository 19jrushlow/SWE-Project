const express = require('express');
const signupController = require('../controllers/signup');

const router = express.Router();

router.get('/signup', signupController.getSignup);
router.post('/signUp', signupController.postSignup);

module.exports = router;
