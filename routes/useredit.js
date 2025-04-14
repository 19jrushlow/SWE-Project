const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');
const AppDataSource = require('../models/data-source').default;
const { User } = require('../models/user');

const router = express.Router();

// GET: Show Edit Profile Page
router.get('/user/edit', (req, res) => {
    if (!req.session?.userId) {
        return res.redirect('/login');
    }

    res.sendFile(path.join(__dirname, '..', 'views', 'editProfile.html'));
});

// POST: Update Username, Email, and Password
router.post('/user/update', async (req, res) => {
    try {
        const userId = req.session.userId;
        const { username, email, password } = req.body;

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: userId });

        if (!user) {
            return res.status(404).send("User not found");
        }

        user.username = username;
        user.email = email;
        user.password = await bcrypt.hash(password, 10);

        await userRepository.save(user);

        res.redirect(`/user/${userId}`);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).send("Failed to update profile");
    }
});

// POST: Delete Account
router.post('/user/delete', async (req, res) => {
    try {
        const userId = req.session.userId;
        const userRepository = AppDataSource.getRepository(User);
        await userRepository.delete({ id: userId });

        req.session.destroy(() => {
            res.redirect('/signup');
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Failed to delete account");
    }
});

module.exports = router;
