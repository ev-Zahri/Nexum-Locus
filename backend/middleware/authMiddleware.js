const { verifyToken } = require('../utils/jwtHelper');
const createError = require('../utils/errorHandler');

/**
 * Middleware untuk memverifikasi token JWT.
 */
const authenticate = (req, res, next) => {
    const token = req.headers['authorization']; // Ambil token dari header Authorization
    if (!token) {
        return res.status(401).json(createError(false, 401, "Unauthenticated", "Token not provided"));
    }

    try {
        const decoded = verifyToken(token); // Decode dan verifikasi token
        req.user = decoded; // Simpan data pengguna di request
        next(); // Lanjut ke middleware/handler berikutnya
    } catch (err) {
        console.error(err);
        return res.status(401).json(createError(false, 401, "Unauthenticated", "Invalid or expired token"));
    }
};

/**
 * Middleware untuk memeriksa role pengguna.
 * @param {Array} roles - Array role yang diizinkan.
 */
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json(createError(false, 403, "Forbidden", "Access denied"));
        }
        next();
    };
};

module.exports = { authenticate, authorize };
