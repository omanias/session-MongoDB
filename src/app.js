const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const MongoStore = require('connect-mongo');
const sessionsRouter = require('./routes/sessions');
const viewsRouter = require('./routes/views');
const User = require('./models/User');
const { createHash, isValidatePassword } = require('../utils');
const passport = require("passport")
const initializePassport = require("./config/passport.config")

const app = express();

mongoose.connect('mongodb+srv://omanias:1234562023@cluster0.3lmci0d.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://omanias:1234562023@cluster0.3lmci0d.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 600,
    }),
    secret: 'coderhouse',
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize())
app.use(passport.session())

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + '/views')
app.set("view engine", "handlebars")


// app.use('/api/sessions', sessionsRouter);
// app.use('/', viewsRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/register', passport.authenticate("register", { failureRedirect: "/failuregister" }), async (req, res) => {
    let { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).send('Faltan datos.');
        // res.render('profile');
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
app.get("/failuregister", async (req, res) => {
    console.log("Falla en autenticacion")
    res.send({ error: "Falla" })
})


app.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    const { first_name, last_name, email, age } = req.session.user;
    console.log(first_name, last_name, email, age)
    res.render('profile', { first_name, last_name, email, age });
    console.log('Usuario logueado con éxito.');
});



app.get('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "valores incorrectos" })
    const user = User.findOne({ email: email }, { email: 1, first_name: 1, last_name: 1, password })
    if (!user) return res.status(400).send({ status: "error", error: "usuario no encontrado" })
    if (!isValidatePassword(user, password)) return res.status(403).send({ status: "error", error: "Password incorrecto" })
    delete user.password
    req.session.user = user
    res.send({ status: "success", payload: user })
});


app.listen(8080, () => {
    console.log('Servidor en ejecución en el puerto 8080');
});
