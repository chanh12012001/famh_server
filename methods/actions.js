var User = require('../models/user')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')

var functions = {
    addNewUser: (req, res) => {
        if (!req.body.phoneNumber || !req.body.password) {
            res.json({success: false, msg: 'Enter all fields'})
        } else {
            var phoneNumber = req.body.phoneNumber
            var password = req.body.password

            User.create({
                phoneNumber: phoneNumber,
                password: password
            }).then(data => {
                res.json({success: true, msg: 'Successfully saved'})
            }).catch(err => {
                console.log(err)
                res.json({success: false, msg: 'Failed to save'})
            })
        }
    },

    authenticate: (req, res) => {
        User.findOne({
            phoneNumber: req.body.phoneNumber
        }).then(data => {
            data.comparePassword(req.body.password, (err, isMatch) => {
                if (isMatch && !err) {
                    var token = jwt.encode(data, config.secret)
                    res.json({success: true, token: token})
                }
                else {
                    return res.status(403).send({success: false, msg: 'Authenticated Failed, wrong password'})
                }
            })
        }).catch(err => { 
            res.status(403).send({success: false, msg: 'Authenticated Failed, User not found'})
        })
    },

    getinfo: (req, res) => {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedToken = jwt.decode(token, config.secret)
            return res.json({success: true, msg: 'Hello ' + decodedToken.phoneNumber})
        } else {
            return res.json({success: false, msg: 'No Header'})
        }
    }
}

module.exports = functions