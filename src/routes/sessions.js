// sessions.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        const user = new User({ first_name, last_name, email, age, password });
        await user.save();

        res.redirect('/login');
    } catch (error) {
        res.status(500).send('Error al registrar el usuario.');
    }
});
module.exports = router;


