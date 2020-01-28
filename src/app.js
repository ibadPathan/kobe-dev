const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')


// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


// Setup the static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather', 
        name: 'Ibad Pathan'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me', 
        name: 'Ibad Pathan'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page', 
        name: 'Ibad Pathan', 
        helpMessage: 'This is the help message'

    })
})
app.get('', (req, res) => {
    res.send('<h1>Weather</h1>')
})

app.get('/weather', (req, res) => {

    if(!req.query.address) {
        return res.sendStatus({
            error: 'You must provide an address'
        })
    } 

    geocode(req.query.address, (error, {latitude, longitude, location}= {}) => {
        if (error) {
            return res.send({error})
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
                return res.send({error})
            }

            res.send({
                forecast: forecastData, 
                location, 
                address: req.query.address
            })
        })
    })

    
})

app.get('/products', (req, res) => {

    if(!req.query.search) {
        return res.send({
            error: 'You must be joking. Provide a search term. '
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
} )

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404', 
        name: 'Ibad Pathan', 
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404', 
        name: 'Ibad Pathan', 
        errorMessage: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('server is up on port ' + port)
})