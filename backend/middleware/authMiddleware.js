const { verifyToken } = require('../utils/jwtHelper');
const createError = require('../utils/errorHandler');
/**
 * Middleware to authenticate a user using JWT token.
 */
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json(createError(false, 401, "Unauthenticated", "Token not provided"));
    }
    
    try {
        const decoded = verifyToken(token);
        req.user = decoded; // Store user data in request object
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json(createError(false, 401, "Unauthenticated", "Invalid or expired token"));
    }
};

module.exports = authenticate;
