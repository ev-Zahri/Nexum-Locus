const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwtHelper');
const createRes = require('../utils/resHandler');
const createError = require('../utils/errorHandler');
const pool = require('../config/db');

const app = express();
// POST /register: Mendaftarkan pengguna baru
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    // Validasi data
    if (!username || !email || !password) {
        return res.status(400).json(createError(false, 400, "Bad Request", "All fields are required"));
    }
    
    try {
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json(createError(false, 400, "Bad Request", "Email already exists"));
        }

        const id = uuidv4().replace(/-/g, '').slice(0, 8);
        const created_at = new Date().toISOString();
        const update_at = created_at;
        const hashedPassword = await bcrypt.hash(password, 8);

        const result = await pool.query(
            'INSERT INTO users (id, username, email, password, created_at, update_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, created_at, update_at',
            [id, username, email, hashedPassword, created_at, update_at]
        );
        return res.status(201).json(createRes(true, 201, "User registered successfully", result.rows[0]));
    } catch (err) {
        return res.status(500).json(createError(false, 500, "Internal Server Error", err.message));
    }
};

// POST /login: Login pengguna
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json(createError(false, 400, "Bad Request", "Email and password are required"));
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json(createError(false, 404, "Not found", "User not found"));
        }

        const user = result.rows[0];

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json(createError(false, 401, "Unauthenticated", "Invalid credentials"));
        }

        const token = generateToken({ id: user.id, email: user.email, role: user.role });
        return res.status(200).json(createRes(true, 200, "Login successful", token));
    } catch (err) {
        return res.status(500).json(createError(false, 500, "Internal Server Error", err.message));
    }
};

// // GET /profile: Mendapatkan detail profil pengguna
exports.getProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (user.rows.length === 0) {
            return res.status(404).json(createError(false, 404, "Not found", "User not found"));
        }
        return res.status(200).json(createRes(true, 200, "User data successfully retrieved", user.rows[0]));
    } catch (err) {
        return res.status(500).json(createError(false, 500, "Internal Server Error", err.message));
    }
};

// // PUT /profile: Memperbarui profil pengguna
exports.updateProfile = async (req, res) => {
    const { id } = req.params;
    const { username, email, password, address, dateOfBirth, role } = req.body;
    try {
        // Ambil data pengguna saat ini dari database
        const currentUserResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (currentUserResult.rows.length === 0) {
            return res.status(404).json(createError(false, 404, "Not found", "User not found"));
        }

        const currentUser = currentUserResult.rows[0];

        // Tetapkan nilai baru berdasarkan request body, atau gunakan nilai lama jika tidak ada
        const updatedusername = username || currentUser.username;
        const updatedEmail = email || currentUser.email;
        const updatedPass = password || currentUser.password;
        const updatedAddress = address || currentUser.address;
        const updatedDateOfBirth = dateOfBirth || currentUser.dateOfBirth;
        const updatedRole = role || currentUser.role;
        const updateAt = new Date().toISOString();

        const hashedPassword = await bcrypt.hash(updatedPass, 8);

        // Perbarui hanya data yang diberikan
        const result = await pool.query(
            'UPDATE users SET username = $2, email = $3, password = $4, address = $5, dateOfBirth = $6, update_at = $7, role = $8  WHERE id = $1 RETURNING id, username, email, password, address, dateOfBirth, update_at, role',
            [id, updatedusername, updatedEmail, hashedPassword, updatedAddress, updatedDateOfBirth, updateAt, updatedRole]
        );
        return res.status(200).json(createRes(true, 200, "Profile updated successfully", result.rows[0]));
    } catch (err) {
        console.error(err);
        return res.status(500).json(createError(false, 500, "Internal Server Error", err.message));
    }
};

// // GET /logout: Logout pengguna
exports.logout = (req, res) => {
    return res.status(200).json(createRes(true, 200, "Logout successful", null));
};