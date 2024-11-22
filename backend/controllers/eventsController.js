const express = require('express');
const { v4: uuidv4 } = require('uuid');
const createRes = require('../utils/resHandler');
const createError = require('../utils/errorHandler');
const pool = require('../config/db');

exports.getAllEvents = async (req, res) => {
    try {
        const event = await pool.query('SELECT * FROM events') || null;
        return res.status(200).json(createRes(true, 200, "List events successfully retrieved", event.rows));
    } catch (err) {
        return res.status(500).json(createError(false, 500, "Internal Server Error", err.message));
    }
}

exports.getEvent = async (req, res) => {
    const { title, artist, price_min, price_max } = req.query;

    try {
        let conditions = [];
        let values = [];

        if (title) {
            conditions.push(`LOWER(title) LIKE LOWER($${values.length + 1})`);
            values.push(`%${title}%`); 
        }
        if (artist) {
            conditions.push(`LOWER(artist) LIKE LOWER($${values.length + 1})`);
            values.push(`%${artist}%`);
        }
        if (price_min) {
            conditions.push(`price >= $${values.length + 1}`);
            values.push(price_min);
        }
        if (price_max) {
            conditions.push(`price <= $${values.length + 1}`);
            values.push(price_max);
        }

        let query = 'SELECT * FROM events';
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const events = await pool.query(query, values);

        if (events.rows.length === 0) {
            return res.status(404).json(createError(false, 404, "Not found", "No events found matching the criteria"));
        }
        return res.status(200).json(createRes(true, 200, "Events successfully retrieved", events.rows[0]));
    } catch (err) {
        return res.status(500).json(createError(false, 500, "Internal Server Error", err.message));
    }
};


exports.addEvent = async (req, res) => {
    const { title, artist, description, location, date, price, available_seats } = req.body;

    if (!title || !artist || !location || !date || !price) {
        return res.status(400).json(createError(false, 400, "Bad Request", "All fields are required"));
    }

    if (!description) {
        description = "Description not yet added";
    }
    
    try {
        const eventCheck = await pool.query('SELECT * FROM events WHERE title = $1', [title]);
        if (eventCheck.rows.length > 0) {
            return res.status(400).json(createError(false, 400, "Bad Request", "Event already exists"));
        }

        const id = uuidv4().replace(/-/g, '').slice(0, 8);
        const created_at = new Date().toISOString();
        const updated_at = created_at;
        const reserved_seats = available_seats;

        const result = await pool.query(
            'INSERT INTO events (id, title, artist, description, location, date, price, available_seats, reserved_seats, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id, title, artist, description, location, date, price, available_seats, reserved_seats, created_at, updated_at',
            [id, title, artist, description, location, date, price, available_seats, reserved_seats, created_at, updated_at]
        );
        return res.status(201).json(createRes(true, 201, "Event registered successfully", result.rows[0]));
    } catch (err) {
        return res.status(500).json(createError(false, 500, "Internal Server Error", err.message));
    }
}


exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, artist, description, location, date, price, available_seats, reserved_seats } = req.body;
    try {
        // Ambil data pengguna saat ini dari database
        const currentEventResult = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
        if (currentEventResult.rows.length === 0) {
            return res.status(404).json(createError(false, 404, "Not found", "Event not found"));
        }

        const currentUser = currentEventResult.rows[0];

        // Tetapkan nilai baru berdasarkan request body, atau gunakan nilai lama jika tidak ada
        const updatedTitle = title || currentUser.title;
        const updatedArtist = artist || currentUser.artist;
        const updatedDescription = description || currentUser.description;
        const updatedLocation = location || currentUser.location;
        const updatedDate = date || currentUser.date;
        const updatedPrice = price || currentUser.price;
        const updatedAvailable_seats = available_seats || currentUser.available_seats;
        const updatedreserved_seats = reserved_seats || currentUser.reserved_seats;
        const updateAt = new Date().toISOString();

        // Perbarui hanya data yang diberikan
        const result = await pool.query(
            'UPDATE events SET title = $2, artist = $3, description = $4, location = $5, date = $6, price = $7, available_seats = $8, reserved_seats = $9, updated_at = $10 WHERE id = $1 RETURNING id, title, artist, description, location, date, price, available_seats, reserved_seats, updated_at',
            [id, updatedTitle, updatedArtist, updatedDescription, updatedLocation, updatedDate, updatedPrice, updatedAvailable_seats, updatedreserved_seats, updateAt]
        );
        return res.status(200).json(createRes(true, 200, "Profile updated successfully", result.rows[0]));
    } catch (err) {
        console.error(err);
        return res.status(500).json(createError(false, 500, "Internal Server Error", err.message));
    }
}

exports.deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const eventCheck = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
        if (eventCheck.rows.length === 0) { 
            return res.status(404).json(createError(false, 404, "Bad Request", "Event not found"));
        }

        const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING id', [id]);

        return res.status(200).json(createRes(true, 200, "Event deleted successfully", result.rows[0]));
    } catch (err) {
        return res.status(500).json(createError(false, 500, "Internal Server Error", err.message));
    }
};
