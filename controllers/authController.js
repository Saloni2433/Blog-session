const passport = require('passport');
const User = require('../models/user');

// Show signup form
module.exports.showSignup = (req, res) => {
    res.render('signup', { error: null });
};

// Handle signup
module.exports.signup = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render('signup', { error: 'Username already exists' });
        }
        // For now, store password as plain text (not recommended for production)
        const user = new User({ username, password });
        await user.save();
        req.login(user, (err) => {
            if (err) return next(err);
            return res.redirect('/blogs');
        });
    } catch (err) {
        console.error(err);
        res.render('signup', { error: 'Error signing up' });
    }
};

// Show login form
module.exports.showLogin = (req, res) => {
    res.render('login', { error: null });
};

// Handle login
module.exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.render('login', { error: info ? info.message : 'Invalid credentials' });
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect('/blogs');
        });
    })(req, res, next);
};

// Handle logout
module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
};

// Export all controller functions as an object
