// sessions.js
const express = require('express');
const router = express.Router();
const { User } = require('../models/User');

router.post('/register', async (req, res) => {
    let { first_name, last_name, email, age, password } = req.body;


    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).send('Faltan datos.');
    }

    const hashedPassword = createHash(password);

    let user = await User.create({
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword
    });

    res.send({ status: "success", payload: user });
    console.log('Usuario registrado con éxito.' + user);
    // res.redirect('/login');
});

module.exports = router;


