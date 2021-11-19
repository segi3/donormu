const axios = require('axios')

const url = 'https://api.mapbox.com/'

//// https://api.mapbox.com/directions/v5/mapbox/driving-traffic/106.1502463,-6.0947954;106.152018,-6.112777?overview=full&geometries=geojson&access_token=

const _fetchMapboxRoute = async (start, end) => {
    try {
        const response = await axios.get(url + 'directions/v5/mapbox/driving-traffic/' + start.long + ',' + start.lat + ';' + end.long + ',' + end.lat + '?overview=full&geometries=geojson&access_token=' + process.env.MAP_BOX_KEY)
        return response.data

    } catch (err) {
        console.log(err)
    }
}

const getRoute = async (start, end) => {

    const data = await _fetchMapboxRoute(start, end)
    return data.routes[0].geometry.coordinates
}

module.exports = {
    getRoute
}