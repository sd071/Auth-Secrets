require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const app = express();

console.log(process.env.SECRET);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
    res.render("home");
});

app.route('/login')

.get((req, res) => {
    res.render("login");
})

.post(async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const foundUser = await User.findOne({email: username});
        if (foundUser) {
            if (foundUser.password === password) {
                res.render('Secrets');
            }
        }
    } catch (err) {
        console.error(err);
    }
});

app.route('/register')

.get((req, res) => {
    res.render("register");
})

.post(async (req, res) => {
    const newUser = new User ({
        email: req.body.username,
        password: req.body.password
    });
    try {
        await newUser.save();
        res.render('Secrets');
    } catch (err) {
        console.error(err);
    }
});






app.listen(3000, function() {
    console.log("Server running on 3000");
  });