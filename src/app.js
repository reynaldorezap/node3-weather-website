const path = require('path');
const express = require('express');
const hbs = require('hbs');
var geocode = require('./utils/geocode');
var forecast = require('./utils/forecast');

const app = express();

// Define path for express config
const publicDirPath = path.join(__dirname,'../public')
const viewPath = path.join(__dirname,'../templates/views')
const partialPath = path.join(__dirname,'../templates/partials')

// Setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views',viewPath)
hbs.registerPartials(partialPath)

// Setup static directory to serve
app.use(express.static(publicDirPath))

// Route
app.get('',(req,res)=>{
    res.render('index',{
        title: 'Weather',
        name: 'Reynaldo Reza Pahlevi'
    })
})

app.get('/about',(req,res)=>{
    res.render('about', {
        title: 'About Me',
        name: 'Reynaldo Reza Pahlevi'
    })
})

app.get('/help',(req,res)=>{
    res.render('help', {
        title: 'Help',
        name: 'Reynaldo Reza Pahlevi',
        helpText: 'This for help text'
    })
})

app.get('/products',(req,res)=>{
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        product:[]
    })
})

app.get('/weather',(req,res)=>{
    if (!req.query.address){
        return res.send({
            error : 'You must provide an adress'
        })
    }
    geocode(req.query.address, (error,{latitude, longitude, location} = {})=>{
        if (error){
            return res.send({ error })
        }
        forecast(latitude, longitude, (error,forcastData)=>{
            if (error){
                return res.send({ error })
            }
            res.send({
                forcast : forcastData,
                location,
                address: req.query.address 
            })
        })
    })
})
app.get('/help/*', (req,res)=>{
    res.render('error',{
        error: 'Article not found',
    })
})

app.get('*', (req,res)=>{
    res.render('error',{
        error: 'PAGE NOT FOUND'
    })
})


app.listen(3000, ()=>{
    console.log('Server is up on port 3000')
})