const mongoose = require('mongoose');

const User = mongoose.model("User", new mongoose.Schema({
    username: { type: String, required: true, min: 4 },
    password: { type: String, required: true, min: 4 }
}))

module.exports = User;