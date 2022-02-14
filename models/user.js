const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require("bcrypt")

const userSchema = new Schema({
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
  }, {
      collection: 'users'
  });

userSchema.pre('save', function(next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return next(err)
            }
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) {
                    return next(err)
                }
                user.password = hash
                next()
            })
        })
    } else {
        return next()
    }
})

userSchema.methods.comparePassword = function(pass, callback) {
    bcrypt.compare(pass, this.password, (err, isMatch) => {
        if (err) {
            return callback(err)
        }
        callback(null, isMatch)
    })
}

module.exports = mongoose.model('users', userSchema)