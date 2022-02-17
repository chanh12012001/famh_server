const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const auth = require('../middlewares/auth');
const { Schema } = require('mongoose');

async function login({username, password}, callback) {
    const user = await User.findOne({username});

    if (user != null) {
        if (bcrypt.compareSync(password, user.password)) {
            const token = auth.generateAccessToken(username)
            return callback(null, {...user.toJSON(), token})
        }
        else {
            return callback({
                message: 'Invalid username/password'
            })
        }
    } else {
        return callback({
            message: 'Invalid username/password'
        })
    }
}

async function register(params, callback) {
    if (params.username === undefined) {
        return callback({
            message: 'Username required'
        })
    } 
    
    User.create({
        username: params.username,
        password: params.password,
        email: params.email
    })
    .then((response) => {
        return callback(null, response)
    })
    .catch((error) => {
        return callback(error)
    })
}

module.exports = {
    login,
    register,
}