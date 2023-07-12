const express = require('express')
const app = express()
const path = require('path')
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const PORT = process.env.PORT || 3500

// Log activities
app.use(logger)

// Allow other parties to access our APIs
app.use(cors(corsOptions))

// Process json files
app.use(express.json())

// Parse Cookies
app.use(cookieParser())

// Set the pathway to access static page
app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))

// Handle all routes not found
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({message: '404 Not Found'})
    } else {
        res.type('txt').send('404 Not Found')
    }
})

// Handle error at the very end
app.use(errorHandler)

app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)})