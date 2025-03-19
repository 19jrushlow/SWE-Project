const path = require('path');
const bcrypt = require('bcryptjs');
const AppDataSource = require('../models/data-source').default;
const { User } = require('../models/user');

module.exports = {
    getLogin: (req, res) => {
        res.sendFile(path.join(__dirname, "..", 'views', 'login.html'));
    },

    postLogin: async (req, res) => {
        try {
            console.log("Received Login Request:", req.body);

            const userRepository = AppDataSource.getRepository(User);
            const { email, password } = req.body;

            // Check if user exists
            const user = await userRepository.findOneBy({ email });
            if (!user) {
                console.error("Invalid username or password");
                return res.status(400).send('Invalid email or password');
            }

            // Check password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.error("Invalid password");
                return res.status(400).send('Invalid email or password');
            }

            // Set session
            req.session.userId = user.id;
            console.log(`Login successful for User ID: ${user.id}`);
            res.redirect(`/user/${user.id}`);
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).send('Error logging in');
        }
    }
};
