const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const MongoStore = require('connect-mongo');
const sessionsRouter = require('./routes/sessions');
const viewsRouter = require('./routes/views');
const User = require('./models/User');

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
})
);

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + '/views')
app.set("view engine", "handlebars")


app.use('/api/sessions', sessionsRouter);
// app.use('/', viewsRouter);


app.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).send('Faltan datos.');
        }
        let user = { first_name, last_name, email, age, password };
        await user.save();

        console.log('Usuario creado con éxito.')

        console.log(user)

        res.redirect('/profile');
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).send('Error al registrar el usuario.');
    }
});

app.get('/profile', (req, res) => {
    /*     if (!req.session.user) {
            return res.redirect('/login');
        } */
    // const { first_name, last_name, email, age } = req.session.user;
    res.render('profile', {}
        // { first_name, last_name, email, age }
    );

    console.log('Usuario logueado con éxito.')

});


app.get('/login', (req, res) => {
    if (!req.session.user) {
        res.render('login');
    } else {
        res.render('/views/profile');
    }
});


app.listen(8080, () => {
    console.log('Servidor en ejecución en el puerto 8080');
});
