const path = require('path');
const bcrypt = require('bcryptjs');
const AppDataSource = require('../models/data-source').default;
const { User } = require('../models/user');

module.exports = {
    getSignup: (req, res) => {
        res.sendFile(path.join(__dirname, "..", 'views', 'signup.html'));
    },

    postSignup: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                return res.status(400).send("Missing required fields");
            }

            // Check if username already exists
            const userRepository = AppDataSource.getRepository(User);
            const existingUser = await userRepository.findOne({ where: { username } });

            if (existingUser) {
                return res.status(400).send("Username is already taken.");
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = userRepository.create({
                username,
                email,
                password: hashedPassword
            });

            await userRepository.save(newUser);

            req.session.userId = newUser.id;
            res.redirect(`/user/${newUser.id}`);
        } catch (error) {
            console.error("Signup error:", error);
            res.status(500).send("Error creating user");
        }
    }
};
