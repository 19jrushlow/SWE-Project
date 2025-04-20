const session = require('express-session');
const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');
const AppDataSource = require('../models/data-source').default;
const { User } = require('../models/user');
const { UserAchievement } = require('../models/user-achievement');
const { UserProblem } = require('../models/user-problem');

const router = express.Router();

router.get('/user/edit', (req, res) => {
    if (!req.session || !req.session.userId) {
      return res.redirect('/login');
    }
  
    res.sendFile(path.join(__dirname, '..', 'views', 'editProfile.html'));
  });
  
// Update user profile (partial updates allowed)
router.post('/user/update', async (req, res) => {
    try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).send("Unauthorized: No session.");
    }

    const { username, email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: userId });

   // Check if username already exists
    const existingUser = await userRepository.findOne({ where: { username } });
    if (existingUser) {
        return res.status(400).send("Username is already taken.");
    }

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (username && username !== user.username) user.username = username;
    if (email && email !== user.email) user.email = email;
    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    await userRepository.save(user);
    res.redirect(`/user/${userId}`);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send("Failed to update profile");
  }
});

// Delete user
router.post('/user/delete', async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).send("Unauthorized: No session.");
    }

    const userAchievementRepo = AppDataSource.getRepository(UserAchievement);
    await userAchievementRepo.delete({ userId: userId });
    const userProblemRepo = AppDataSource.getRepository(UserProblem);
    await userProblemRepo.delete({ userId });
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.delete({ id: userId });

    req.session.destroy((err) => {
      if (err) {
        console.error("Error ending session after deletion:", err);
        return res.status(500).send("Account deleted, but session cleanup failed.");
      }

      res.redirect('/signup');
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Failed to delete user.");
  }
});

module.exports = router;
