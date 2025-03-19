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
            console.log("Received Request Body:", req.body);  

            const { email, password } = req.body;

            if (!email || !password) {
                console.error("Missing email or password");
                return res.status(400).send("Missing required fields");
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            
            const userRepository = AppDataSource.getRepository(User);
            const newUser = userRepository.create({ email, password: hashedPassword });
            await userRepository.save(newUser);

            console.log("User saved successfully!", newUser);
            req.session.userId = newUser.id;
            res.redirect(`/user/${newUser.id}`);
        } catch (error) {
            console.error("Signup error:", error);
            res.status(500).send("Error creating user");
        }
    }
};
