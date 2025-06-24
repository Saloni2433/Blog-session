// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Redirect to login if not authenticated (for home page)
function requireAuth(req, res, next) {
    if (req.session.isAuthenticated) {
        return next();
    }
    res.redirect('/login');
}

// Make session info available to EJS
function setLocals(req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated && req.isAuthenticated();
    res.locals.username = req.user ? req.user.username : null;
    next();
}

module.exports = {
    isAuthenticated,
    requireAuth,
    setLocals
}; 