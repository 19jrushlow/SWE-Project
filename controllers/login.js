const path = require('path');

module.exports = {
    // render login page
    getLogin: (req, res) => {
        res.sendFile(path.join(__dirname, "..", 'views', 'login.html'));
    },
    // handle login form submission
    postLogin: (req, res) => {
        // For now, just redirect to home after login
        res.redirect('/home');
    }
};