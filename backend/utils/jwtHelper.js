const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_TOKEN;

/**
 * Generate a JWT token for a user.
 * @param {Object} payload - Data to be encoded in the token (e.g., user ID).
 * @param {String} expiresIn - Expiry duration (default: '1h').
 * @returns {String} Signed JWT token.
 */
const generateToken = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Verify a JWT token.
 * @param {String} token - Token to verify.
 * @returns {Object} Decoded token payload if valid.
 */
const verifyToken = (token) => {
    if (!token) {
        throw new Error("Token is required");
    }
    return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
