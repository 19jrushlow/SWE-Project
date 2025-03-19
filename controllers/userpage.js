const path = require('path');
const AppDataSource = require('../models/data-source').default;
const { User } = require('../models/user');

module.exports = {
    getUserProfile: async (req, res) => {
        try {
            if (!AppDataSource.isInitialized) {
                await AppDataSource.initialize();
            }
            
            const userRepository = AppDataSource.getRepository(User);
            const userId = req.session.userId; // Get user from session

            if (!userId) {
                return res.redirect('/login'); // Redirect if not logged in
            }

            // Fetch user from database
            const user = await userRepository.findOneBy({ id: userId });

            if (!user) {
                return res.status(404).send('User not found');
            }

            res.sendFile(path.join(__dirname, '..', 'views', 'userProfile.html'));
        } catch (error) {
            console.error('Error fetching user profile:', error);
            res.status(500).send('Server error');
        }
    }
};