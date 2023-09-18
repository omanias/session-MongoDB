const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: String,
    password: String,
});

const User = mongoose.model('usesrs', userSchema);

module.exports = User;