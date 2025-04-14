const express = require('express');
const path = require('path');
const AppDataSource = require('../models/data-source').default;
const { User } = require('../models/user');

const router = express.Router();

router.get('/user/:id', async (req, res) => {
    try {
        if (!req.session || !req.session.userId) {
            return res.redirect('/login'); // Redirect if not logged in
        }

        const userId = req.session.userId; // Get user from session
        console.log(`Fetching profile for user ID: ${userId}`);

        if (userId != req.params.id) {
            return res.status(403).send("Unauthorized access");
        }

        res.sendFile(path.join(__dirname, '..', 'views', 'userProfile.html'));
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send("Error retrieving user profile");
    }
});

module.exports = router;
