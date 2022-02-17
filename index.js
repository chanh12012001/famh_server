const PORT = process.env.PORT || 3000
const express = require("express");
const routes = require('./routes/user.routes')
const connectDB = require('./config/db')
const auth = require('./middlewares/auth')
const errors = require('./middlewares/errors')
const bodyParser = require("body-parser");

connectDB()

const unless = require("express-unless");
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

auth.authenticateToken.unless = unless
app.use(
    auth.authenticateToken.unless({
        path: [
            {url: '/users/login', methods: ['POST']},
            {url: '/users/register', methods: ['POST']},
        ]
    })
)

app.use(express.json())

app.use('/users', routes)

app.use(errors.errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})