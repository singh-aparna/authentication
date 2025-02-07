const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/User');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const secret = process.env.secret;
app.use(express.json());
app.use(cookieParser());

const salt = bcrypt.genSaltSync(10);
const mongodb = process.env.localdbURL;

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true });
app.get('/', (req, res) => {
    res.send('Server is up!');
});

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        //check if username already exist
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(401).json({ message: "Username already exist!" });
        }
        const user = new User({ username, password: bcrypt.hashSync(password, salt) });
        await user.save().then(userInfo => {
            jwt.sign({ id: userInfo._id, username: userInfo.username }, secret, (err, token) => {
                //console.log(err);
                return res.cookie('token', token).json({ id: userInfo._id, username: userInfo.username });
            })
        })
    }
    catch (err) {
        //console.log(err);
        res.status(500).json({ err: "Internal server error!" });
    }
})

app.get('/user', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json({ message: "No token!" })
        }
        const payload = jwt.verify(token, secret);
        await User.findById(payload.id).then(userInfo => {
            if (!userInfo) {
                return res.json({ message: "Invalid credentials!" })
            }
            return res.json({ id: userInfo._id, username: userInfo.username });
        })
    }
    catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(400).json({ error: "Token expired!" });
        }
        return res.status(401).json({ error: "Invalid token!" });
    }
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json({ message: "Logout succesfully!" });
})

app.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        User.findOne({ username }).then(userInfo => {
            if (!userInfo) {
                return res.status(401).json({ message: "Username not found!" })
            }
            const passOk = bcrypt.compareSync(password, userInfo.password);
            if (!passOk) {
                return res.status(403).json({ message: "Incorrect password!!" });
            }
            //Genearte jwt token
            jwt.sign({ id: userInfo._id }, secret, (err, token) => {
                res.cookie('token', token).json({ id: userInfo._id, username: userInfo.username });
            })
        })
    }
    catch (err) {
        res.status(500).json({ error: "Network error!" });
    }
})

app.listen(4000, (req, res) => {
    console.log('Server is working!');
});

//Key Points=>
//app.use(express.json()); is a middleware in Express that parses incoming JSON request bodies and makes them available in req.body.