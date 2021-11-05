require('dotenv').config()
const express = require('express')
var path = require('path')

const app = express()
const port = 3000

// utils
const helper = require('./utils/helper')

// geo
const awsgeo = require('./dynamodb-geo')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//setup public folder
app.use(express.static('public'))

app.get('/api/auth', (req, res) => {
    res.status(200).send({
        message: 'success',
        key: process.env.MAP_BOX_KEY
    })
})

app.get('/', function (req, res) {
    res.render('pages/home', { key:process.env.MAP_BOX_KEY })
})



app.listen(port, () => console.log(`app Started on port ${port}!`))