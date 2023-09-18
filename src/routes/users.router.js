// sessions.js
const express = require('express');
const router = express.Router();
const { User } = require('../models/User');


const router = Router()

router.get("/login", async(req,res)=>{
    res.render("login")
})

router.get("/register", async(req,res)=>{
    res.render("register")
})

router.get("/profile", async(req,res)=>{
    if(!req.session.user){
        return res.redirect("login")
    }

    const {first_name, last_name,email,age}=req.session.user

    res.render("profile", {first_name,last_name,age,email})
})

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;


    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).send('Faltan datos.');
    }

    const hashedPassword = createHash(password);

    const user = await User.create({
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

router.post("/login", async(req,res)=>{
    const {email,password} =req.body
    if(!email || !password) return res.status(400).render("login", {error: "Valores erroneos"})

    const user = await User.findOne({email},{first_name: 1, last_name: 1, age: 1, password:1, email: 1})

    if(!user) return res.status(400).render("login",{error: "Usuario no encontrado})
    if(!isValidatePassword(user,password)){
        return res.status(401).render("login",{error: "Error en password"})
    }
})

router.get("/logout", async(req,res)=>{
    delete req.session.user
    res.redirect("login")
})



module.exports = router;


