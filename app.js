require('dotenv').config()
const express = require('express')
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var path = require('path')

const app = express()
const port = 3000
app.use(express.json())

// utils
const helper = require('./utils/helper')

// geo
const awsgeo = require('./dynamodb-geo')

// mapbox controller
const { getRoute } = require('./controller/mapboxController')

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

app.post('/api/addPendonor', async (req, res) => {
    
    await awsgeo.addData(req.body)

    res.status(200).send({
        message: 'success'
    })
})

app.post('/api/addPendonor2', jsonParser, async(req, res)=> {
    console.log("Body: ", req.body )

    res.status(200).send({
        message: 'success'
    })
})

// ?slong=106.150242&slat=-6.0947983&flong=106.154284&flat=-6.097460

app.get('/api/getRoute', async (req, res) => {
    const { slong, slat, flong, flat } = req.query

    const route = await getRoute({
        long: slong,
        lat: slat
    }, {
        long: flong,
        lat: flat
    })

    res.status(200).send(route)
})

app.get('/api/getNear', (req, res) => {

    // http://localhost:3000/api/getNear?longitude=106.147300&latitude=-6.111800

    const center = {
        longitude: req.query.longitude,
        latitude: req.query.latitude
    }

    console.log(center)

    awsgeo.radiusQuery(center, 1)
        .then((queryResult) => {

            var pendonorData = []

            pendonorCoords = JSON.parse(queryResult[0].geoJson.S)

            for (var i = 0; i<queryResult.length; i++) {

                let tmp_coord = JSON.parse(queryResult[i].geoJson.S)

                pendonorData.push({
                    range_key: queryResult[i].rangeKey.S,
                    nama: queryResult[i].name.S,
                    umur: queryResult[i].age.S,
                    alamat: queryResult[i].alamat.S,
                    nohp: queryResult[i].nohp.S,
                    email: queryResult[i].email.S,
                    golongan_darah: queryResult[i].goldarah.S,
                    resus: queryResult[i].resus.S,
                    berat_badan: queryResult[i].beratBadan.S,
                    tinggi_badan: queryResult[i].tinggiBadan.S,
                    coordinates: {
                        latitude: tmp_coord.coordinates[1],
                        longitude: tmp_coord.coordinates[0]
                    }
                })
            }

            res.status(200).send({
                message: 'success',
                data: pendonorData
            })
        })
    

})

app.get('/', function (req, res) {
    res.render('pages/home')
})



app.listen(port, () => console.log(`app Started on port ${port}!`))