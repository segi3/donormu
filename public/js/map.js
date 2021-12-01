var map, curLong, curLat

var pmiLng = 106.1598511,
    pmiLat = -6.1180359

fetch('/api/auth')
    .then(response => response.json())
    .then((data) => {
        console.log(data.message)

        mapboxgl.accessToken = data.key

        navigator.geolocation.getCurrentPosition((position) => {

            // success
            console.log(position)
            curLong = position.coords.longitude
            curLat = position.coords.latitude

            curLong = 106.150290
            curLat = -6.094859

            MapApp(curLong, curLat)

        }, () => {
            // error
            console.log("ERROR")
            MapApp(106.845599, -6.2087634)

        }, {
            enableHighAccuracy: true
        })

        const MapApp = (long, lat) => {

            map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [long, lat],
                // center: [106.150289, -6.094634],
                zoom: 17
            });

            const nav = new mapboxgl.NavigationControl()

            map.addControl(nav)

            // addRoute(long, lat)

            // map.setCenter([106.154284, -6.09746])

            getPendonorList(long, lat)
            
            // add marker for your location
            map.on('load', () => {
                map.loadImage(
                    'http://localhost:3000/asset/blue.png',
                    (error, image) => {
                        if (error) throw error;
                        map.addImage('my-marker', image);
                        map.addSource('myPoints', {
                            'type': 'geojson',
                            'data': {
                                'type': 'FeatureCollection',
                                'features': [{
                                        // feature for Mapbox DC
                                        'type': 'Feature',
                                        'geometry': {
                                            'type': 'Point',
                                            'coordinates': [
                                                parseFloat(long), parseFloat(lat)
                                            ]
                                        },
                                        'properties': {
                                            'title': 'Anda'
                                        }
                                    }
                                ]
                            }
                        });

                        // Add a symbol layer
                        map.addLayer({
                            'id': 'myPointsLayer',
                            'type': 'symbol',
                            'source': 'myPoints',
                            'layout': {
                                'icon-image': 'my-marker',
                                // get the title name from the source's "title" property
                                'text-field': ['get', 'title'],
                                'text-font': [
                                    'Open Sans Semibold',
                                    'Arial Unicode MS Bold'
                                ],
                                'text-offset': [0, 1.25],
                                'text-anchor': 'top'
                            }
                        });
                    }
                );
            });

            // pmi marker
            map.on('load', () => {
                map.loadImage(
                    'http://localhost:3000/asset/amber.png',
                    (error, image) => {
                        if (error) throw error;
                        map.addImage('markerPMIimage', image);
                        map.addSource('markerPMI', {
                            'type': 'geojson',
                            'data': {
                                'type': 'FeatureCollection',
                                'features': [{
                                        // feature for Mapbox DC
                                        'type': 'Feature',
                                        'geometry': {
                                            'type': 'Point',
                                            'coordinates': [
                                                parseFloat(pmiLng), parseFloat(pmiLat)
                                            ]
                                        },
                                        'properties': {
                                            'title': 'UDD PMI Kabupaten Serang'
                                        }
                                    }
                                ]
                            }
                        });
        
                        // Add a symbol layer
                        map.addLayer({
                            'id': 'markerPMILayer',
                            'type': 'symbol',
                            'source': 'markerPMI',
                            'layout': {
                                'icon-image': 'markerPMIimage',
                                // get the title name from the source's "title" property
                                'text-field': ['get', 'title'],
                                'text-font': [
                                    'Open Sans Semibold',
                                    'Arial Unicode MS Bold'
                                ],
                                'text-offset': [0, 1.25],
                                'text-anchor': 'top'
                            }
                        });
                    }
                );
            });

            map.on('click', 'points', function (e) {

                map.getCanvas().style.cursor = 'pointer';
        
                var coordinates = e.features[0].geometry.coordinates.slice();
                var title = e.features[0].properties.title;

                console.log(title, coordinates)
        
                addRoute(curLong, curLat, coordinates[0], coordinates[1])
                addPKMRoute(coordinates[0], coordinates[1], pmiLng, pmiLat)
                layerReorder()
            });
        }
    });

const layerReorder = () => {

    // var layers = map.getStyle().layers;
    // for (var i=0; i<layers.length; i++) {
    //     console.log(layers[i])
    // }
    // console.log(map.getStyle())

    // map.moveLayer('route')
    // map.moveLayer('routeToPMI')
    map.moveLayer('myPointsLayer') // current loc marker
    map.moveLayer('markerPMILayer')
    // map.moveLayer('distanceLabelLayerToPMI')
    map.moveLayer('points') // pendonor loc marker
    // map.moveLayer('distanceLabelLayer')
}

const addNewRoute = () => {
    map.addLayer({
        id: 'route',
        type: 'line',
        source: {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [
                        [106.150333, -6.094783],
                        [106.15035, -6.094895],
                        [106.150349, -6.095218],
                        [106.150326, -6.095249],
                        [106.15027, -6.09526],
                        [106.150128, -6.095255],
                        [106.149892, -6.095254],
                        [106.14965, -6.09525]
                    ],
                },
            }
        },
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': '#FF0000',
            'line-width': 8
        }
    })
}

const deleteExistingRouteToPMI = () => {
    try {
        map.removeLayer('routeToPMI')
        map.removeSource('routeToPMI')
    } catch(err) {
        console.log(err)
    }
}
const deleteExistingRouteLabelToPMI = () => {
    try {
        map.removeLayer('distanceLabelLayerToPMI')
        map.removeSource('distanceLabelToPMI')
    } catch(err) {
        console.log(err)
    }
}

const addPKMRoute = async (slong, slat, flong, flat) => {

    deleteExistingRouteToPMI()
    deleteExistingRouteLabelToPMI()

    $.ajax({
        url: "/api/getRoute?slong="+slong+"&slat="+slat+"&flong="+flong+"&flat="+flat,
        method: 'get',
        success: function (result) {

            map.addLayer({
                id: 'routeToPMI',
                type: 'line',
                source: {
                    'type': 'geojson',
                    'data': {
                        'type': 'Feature',
                        'properties': {},
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': result.route,
                        },
                    }
                },
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#FF0000',
                    'line-width': 5
                }
            })

            // add distance label
            map.addSource('distanceLabelToPMI', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [{
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [
                                    parseFloat(flong), parseFloat(flat)
                                ]
                            },
                            'properties': {
                                'description': result.distance + " m"
                            }
                        }
                    ]
                }
            });

            map.addLayer({
                'id': 'distanceLabelLayerToPMI',
                'type': 'symbol',
                'source': 'distanceLabelToPMI',
                'layout': {
                    'text-field': ['get', 'description'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold'
                    ],
                    'text-offset': [0, -3],
                    'text-anchor': 'top'
                }
            });
        }
    });

    
}

const getPendonorList = (long, lat) => {

    $.ajax({
        url: "/api/getNear?longitude=" + long + "&latitude=" + lat,
        method: 'get',
        success: function (result) {
            const data = result.data

            for (var i = 0; i < data.length; i++) {
                $('#list-pendonor').append(`

                <div class="p-1 mt-1 card pendonor-item filter-`+ data[i].golongan_darah + ` filter-`+ data[i].resus +`"
                    onclick="pendonorClick(this)"
                    id="pendonor-` + data[i].range_key + `"
                    data-gol="`+data[i].golongan_darah +`"
                    data-resus="` + data[i].resus + `"
                    data-long="` + data[i].coordinates.longitude + `"
                    data-lat="` + data[i].coordinates.latitude + `">
                    <div class="card-body">
                        <div class="d-flex">
                            <div class="d-flex flex-column align-items-center p-0" style="flex: 0 0 50px;">
                                <h2 class="align-self-center" style="">` + data[i].golongan_darah + `</h2>
                                <span class="badge badge-resus badge-danger">` + data[i].resus + `</span>
                            </div>
                            <div class="pl-2 d-flex align-items-center">
                                <h5 class="align-self-center">` + data[i].nama + `</h5>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-6">
                                <div class="row panel-badan">
                                    <div class="col-12">
                                        <strong>Umur:</strong> ` + data[i].umur + `
                                    </div>
                                </div>
                                <div class="row panel-badan">
                                    <div class="col-12">
                                        <strong>Berat Badan:</strong>
                                    </div>
                                    <div class="col-12">
                                    ` + data[i].berat_badan + ` kg
                                    </div>
                                </div>
                                <div class="row panel-badan">
                                    <div class="col-12">
                                        <strong>Tinggi Badan:</strong>
                                    </div>
                                    <div class="col-12">
                                    ` + data[i].tinggi_badan + ` cm
                                    </div>
                                </div>
                                
                            </div>
                            <div class="col-6">
                                <div class="row panel-badan">
                                    <div class="col-12">
                                        <strong>Email:</strong>
                                    </div>
                                    <div class="col-12">
                                    ` + data[i].email + `
                                    </div>
                                </div>
                                <div class="row panel-badan">
                                    <div class="col-12">
                                        <strong>No Hp:</strong>
                                    </div>
                                    <div class="col-12">
                                    ` + data[i].nohp + `
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `)
            }

            // process data
            var marker_data = []

            for (var i = 0; i < data.length; i++) {

                marker_data.push({
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [
                            parseFloat(data[i].coordinates.longitude),
                            parseFloat(data[i].coordinates.latitude)
                        ]
                    },
                    'properties': {
                        'title': data[i].nama,
                    }
                })
            }

            map.loadImage(
                'http://localhost:3000/asset/marker.png',
                (error, image) => {
                    if (error) throw error
                    console.log(data)
                    map.addImage('custom-marker', image)
                    // Add a GeoJSON source with 2 points
                    map.addSource('points', {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': marker_data
                        }
                    });

                    // Add a symbol layer
                    map.addLayer({
                        'id': 'points',
                        'type': 'symbol',
                        'source': 'points',
                        'layout': {
                            'icon-image': 'custom-marker',
                            // get the title name from the source's "title" property
                            'text-field': ['get', 'title'],
                            'text-font': [
                                'Open Sans Semibold',
                                'Arial Unicode MS Bold'
                            ],
                            'text-offset': [0, 1.25],
                            'text-anchor': 'top'
                        }
                    });
                }
            );
        }
    });
}

const deleteExistingRoute = () => {
    try {
        map.removeLayer('route')
        map.removeSource('route')
    } catch(err) {
        console.log(err)
    }
}

const deleteExistingDistanceLabel = () => {
    try {
        map.removeLayer('distanceLabelLayer')
        map.removeSource('distanceLabel')
    } catch(err) {
        console.log(err)
    }
}

const addRoute = async (slong, slat, flong, flat) => {

    deleteExistingRoute()
    deleteExistingDistanceLabel()

    $.ajax({
        url: "/api/getRoute?slong="+slong+"&slat="+slat+"&flong="+flong+"&flat="+flat,
        method: 'get',
        success: function (result) {

            map.addLayer({
                id: 'route',
                type: 'line',
                source: {
                    'type': 'geojson',
                    'data': {
                        'type': 'Feature',
                        'properties': {},
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': result.route,
                        },
                    }
                },
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#3d85c6',
                    'line-width': 5
                }
            })

            // add distance label
            map.addSource('distanceLabel', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [{
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [
                                    parseFloat(flong), parseFloat(flat)
                                ]
                            },
                            'properties': {
                                'description': result.distance + " m"
                            }
                        }
                    ]
                }
            });

            map.addLayer({
                'id': 'distanceLabelLayer',
                'type': 'symbol',
                'source': 'distanceLabel',
                'layout': {
                    'text-field': ['get', 'description'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold'
                    ],
                    'text-offset': [0, -3],
                    'text-anchor': 'top'
                }
            });

            map.flyTo({center:[flong, flat]})
        }
    });
  
}

const resetPendonorCardColor = () => {
    $("#list-pendonor > .card").removeClass("card-pendonor-active")
    $(".badge-resus").removeClass("badge-resus-active")
}

const pendonorClick = async (input) => {

    resetPendonorCardColor()

    var id = input.getAttribute('id')

    console.log(id)

    // tambah class active
    $('#' + id).addClass('card-pendonor-active')
    const resus_badge = $('#' + id).find('.badge')
    resus_badge.addClass('badge-resus-active')

    var long = input.getAttribute('data-long')
    var lat = input.getAttribute('data-lat')
    
    console.log('dari curr ' + curLong + ' ' + curLat)
    console.log('dari card ' + long + ' ' + lat)

    await addRoute(curLong, curLat, long, lat)
    await addPKMRoute(long, lat, pmiLng, pmiLat)
    layerReorder()
}

var golonganF = 'ALL'
var resusF = 'ALL'
const resetGolActive = () => {
    $('.filter-gol').removeClass('filter-gol-active')
}
const resetResusActive = () => {
    $('.filter-resus').removeClass('filter-resus-active')
}
const filterGolongan = (input) => {

    golonganF = input.getAttribute('data-gol')

    resetGolActive()
    
    console.log(golonganF, resusF)

    if (golonganF == 'ALL') {
        $('#gol-F-' + 'ALL').addClass('filter-gol-active')

        $('.pendonor-item').hide()
        $('.filter-negatif').show()
        $('.filter-positif').show()
        return
    } else if (resusF == 'ALL') {
        $('#gol-F-' + golonganF).addClass('filter-gol-active')

        $('.pendonor-item').hide()
        $('.filter-' + golonganF).show()
        return
    }

    $('#gol-F-' + golonganF).addClass('filter-gol-active')
    $('.pendonor-item').hide()
    $('.filter-' + golonganF + '.filter-' + resusF).show()
}

const filterResus = (input) => {

    resusF = input.getAttribute('data-resus')

    resetResusActive()

    console.log(golonganF, resusF)

    if (resusF == 'ALL') {
        $('#resus-F-' + 'ALL').addClass('filter-resus-active')

        $('.pendonor-item').hide()
        $('.filter-A').show()
        $('.filter-B').show()
        $('.filter-AB').show()
        $('.filter-O').show()
        return
    } else if (golonganF == 'ALL') {
        $('#resus-F-' + resusF).addClass('filter-resus-active')
        $('.pendonor-item').hide()
        $('.filter-' + resusF).show()
        return
    }

    $('#resus-F-' + resusF).addClass('filter-resus-active')
    $('.pendonor-item').hide()
    $('.filter-' + golonganF + '.filter-' + resusF).show()
}

$(document).ready(function () {
    
});