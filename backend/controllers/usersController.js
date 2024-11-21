const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwtHelper');
const createRes = require('../utils/resHandler');
const pool = require('../config/db');

const app = express();
// POST /register: Mendaftarkan pengguna baru
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    // Validasi data
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Cek apakah email sudah digunakan
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const id = uuidv4().replace(/-/g, '').slice(0, 8);
        const created_at = new Date().toISOString();
        const update_at = created_at;
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 8);

        // Simpan pengguna ke database
        const result = await pool.query(
            'INSERT INTO users (id, username, email, password, created_at, update_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, created_at, update_at',
            [id, username, email, hashedPassword, created_at, update_at]
        );
        res.status(201).json(createRes("success", 201, "User registered successfully", result.rows[0]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// POST /login: Login pengguna
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Cek pengguna berdasarkan email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Periksa password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken({ id: user.id, email: user.email });

        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// // GET /profile: Mendapatkan detail profil pengguna
// app.get('/profile', authenticate, async (req, res) => {
//     try {
//         const user = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [req.user.id]);
//         if (user.rows.length === 0) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         res.json({ user: user.rows[0] });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // PUT /profile: Memperbarui profil pengguna
// app.put('/profile', authenticate, async (req, res) => {
//     const { name, email } = req.body;

//     try {
//         const result = await pool.query(
//             'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email',
//             [name, email, req.user.id]
//         );

//         if (result.rows.length === 0) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         res.json({ message: 'Profile updated successfully', user: result.rows[0] });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // GET /logout: Logout pengguna
// app.get('/logout', (req, res) => {
//     // Logout biasanya menghapus token di sisi klien
//     res.json({ message: 'Logout successful' });
// });