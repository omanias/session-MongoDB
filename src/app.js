const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const sessionsRouter = require('./routes/sessions');
const viewsRouter = require('./routes/views');
const app = express();

mongoose.connect('mongodb+srv://omanias:1234562023@cluster0.3lmci0d.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: 'coderhouse',
        resave: false,
        saveUninitialized: true,
    })
);

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + 'routes/views')
app.set("view engine", "handlebars")


app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);

app.listen(8080, () => {
    console.log('Servidor en ejecución en el puerto 8080');
});
