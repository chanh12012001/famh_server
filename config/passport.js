var JwtStrategy = require('passport-jwt').Strategy
var ExtractJwt = require('passport-jwt').ExtractJwt

var User = require('../models/user')
var config = require('./dbconfig')

// module.exports = function (passport) {
//     var opts = {}

//     opts.secretOrkey = config.secret
//     opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')

//     passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
//         User.find({
//             id: jwt_payload.id
//         }), (err, dataUser) => {
//             if (err) {
//                 return done(err, false)
//             }
//             if (dataUser) {
//                 return done(null, dataUser) 
//             }
//             else {
//                 return done(null, false)
//             }
//         }
//     }))
// }

module.exports = function(passport){
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.getUserById(jwt_payload._doc._id, (err, user) => {
            if(err){
                return done(err, false);
            }
            if(user){
                return done(null, user);
            } else{
                return done(null, false);
            }
        });
    }));
}