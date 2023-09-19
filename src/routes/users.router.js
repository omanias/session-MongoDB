// sessions.js
const express = require('express');
const router = express.Router();
const usuario = require('../models/User');
const { createHash, isValidatePassword } = require('../../utils');
const passport = require("passport")


router.get("/login", async (req, res) => {
    res.render("login")
})

router.get("/register", async (req, res) => {
    res.render("register")
})

router.get("/profile", async (req, res) => {
    if (!req.session.user) {
        return res.redirect("login")
    }

    const { first_name, last_name, email, age } = req.session.user

    res.render("profile", { first_name, last_name, age, email })
})

router.post('/register', passport.authenticate("register", { failureRedirect: "/failregister" }), async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;


    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).send('Faltan datos.');
    }

    const hashedPassword = createHash(password);

    const user = await usuario.create({
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword
    });

    res.send({ status: "success", payload: user });
    console.log('Usuario registrado con éxito.' + user);
    res.redirect('/login');
});

router.get("/failregister", async (req, res) => {
    console.log("Falla en autenticacion")
    res.send({ error: "Falla" })
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).render("login", { error: "Valores erroneos" });

    const user = await usuario.findOne({ email }, { first_name: 1, last_name: 1, age: 1, password: 1, email: 1 });

    if (!user) {
        return res.status(400).render("login", { error: "Usuario no encontrado" });
    }

    if (!isValidatePassword(user, password)) {
        return res.status(401).render("login", { error: "Error en password" });
    }

    // Set the user session here if login is successful
    req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age
    };

    // Redirect the user after successful login
    res.redirect("/api/sessions/profile");
});

/*
router.post("/login", passport.authenticate("login", { failureRedirect: "/faillogin" }), async (req, res) => {
    if (!req.session.user) {
        return res.status(400).send("Usuario no encontrado")
    }
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age
    }
    res.send({ status: "success", payload: req.user })
}
) */

router.get("/logout", async (req, res) => {
    delete req.session.user
    res.redirect("login")
})

router.get("/faillogin", async (req, res) => {
    console.log("Falla en autenticacion")
    res.send({ error: "Falla" })
})

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
    req.session.user = req.user
    res.redirect("/api/sessions/profile")

})


module.exports = router;


