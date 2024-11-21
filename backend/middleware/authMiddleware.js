const { verifyToken } = require('../utils/jwtHelper');

/**
 * Middleware to authenticate a user using JWT token.
 */
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded; // Store user data in request object
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticate;
