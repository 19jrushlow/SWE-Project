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
            const { username, password } = req.body;

            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ username });

            if (!user) {
                return res.status(400).send('Invalid username or password');
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).send('Invalid username or password');
            }

            req.session.userId = user.id;
            res.redirect(`/user/${user.id}`);
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).send('Error logging in');
        }
    }
};
