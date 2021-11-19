var map

const addMyCursor = async (long, lat) => {

}

fetch('/api/auth')
    .then(response => response.json())
    .then((data) => {
        console.log(data.message)

        mapboxgl.accessToken = data.key

        navigator.geolocation.getCurrentPosition((position) => {

            // success
            console.log(position)
            MapApp(position.coords.longitude, position.coords.latitude)

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

            getPendonorList(long, lat)

            map.on('load', () => {
                // Add an image to use as a custom marker
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
        }
    });

const deleteExistingRoute = () => {
    console.log('deleted')
    map.removeLayer('route')
    map.removeSource('route')
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

const addRoute = () => {
    map.on('load', () => {
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
                            [106.14965, -6.09525],
                            [106.149416, -6.095246],
                            [106.149409, -6.095316],
                            [106.150492, -6.095334],
                            [106.150522, -6.095409],
                            [106.150318, -6.095401],
                            [106.149402, -6.095403],
                            [106.148577, -6.0954],
                            [106.148525, -6.095768],
                            [106.148453, -6.096354],
                            [106.148399, -6.096718],
                            [106.148347, -6.097052],
                            [106.148247, -6.097625],
                            [106.148238, -6.0977],
                            [106.14821, -6.097913],
                            [106.148166, -6.098316],
                            [106.148153, -6.098499],
                            [106.148078, -6.098972],
                            [106.147976, -6.099452],
                            [106.147852, -6.100019],
                            [106.147767, -6.100418],
                            [106.147719, -6.100682],
                            [106.147628, -6.10116],
                            [106.147554, -6.101519],
                            [106.147504, -6.101728],
                            [106.147486, -6.101824],
                            [106.147456, -6.102038],
                            [106.147415, -6.102284],
                            [106.147398, -6.102466],
                            [106.147372, -6.102709],
                            [106.147357, -6.103207],
                            [106.147334, -6.103474],
                            [106.147305, -6.1039],
                            [106.147293, -6.103973],
                            [106.147294, -6.104067],
                            [106.147287, -6.104246],
                            [106.147286, -6.104282],
                            [106.147385, -6.10485],
                            [106.14742, -6.105136],
                            [106.14745, -6.10531],
                            [106.14749, -6.105558],
                            [106.147557, -6.105837],
                            [106.147613, -6.106151],
                            [106.147682, -6.106532],
                            [106.14772, -6.106761],
                            [106.147767, -6.107173],
                            [106.147782, -6.107344],
                            [106.147816, -6.107588],
                            [106.147829, -6.107649],
                            [106.147838, -6.107797],
                            [106.147853, -6.107953],
                            [106.147857, -6.108017],
                            [106.147895, -6.1086],
                            [106.147904, -6.108721],
                            [106.147924, -6.109055],
                            [106.147927, -6.109177],
                            [106.147924, -6.109425],
                            [106.147905, -6.109668],
                            [106.147865, -6.109852],
                            [106.147785, -6.110109],
                            [106.147644, -6.110663],
                            [106.147451, -6.111283],
                            [106.147299, -6.111704],
                            [106.147925, -6.111886],
                            [106.148025, -6.111911],
                            [106.148549, -6.112005],
                            [106.148877, -6.112039],
                            [106.149518, -6.112116],
                            [106.149579, -6.112128],
                            [106.150017, -6.112207],
                            [106.15042, -6.112294],
                            [106.150744, -6.112358],
                            [106.150806, -6.112371],
                            [106.150875, -6.11242],
                            [106.151033, -6.112463],
                            [106.151157, -6.112497],
                            [106.15142, -6.11257],
                            [106.1517, -6.112647],
                            [106.15174, -6.112657],
                            [106.15202, -6.112734]
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

                <div class="p-1 mt-1 card" onclick="pendonorClick(this)" id="pendonor-` + data[i].range_key + `" data-long="` + data[i].coordinates.longitude + `" data-lat="` + data[i].coordinates.latitude + `">
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

const resetPendonorCardColor = () => {
    $("#list-pendonor > .card").removeClass("card-pendonor-active")
    $(".badge-resus").removeClass("badge-resus-active")
}

const pendonorClick = (input) => {

    resetPendonorCardColor()

    var id = input.getAttribute('id')

    console.log(id)

    // tambah class active
    $('#' + id).addClass('card-pendonor-active')
    const resus_badge = $('#' + id).find('.badge');
    resus_badge.addClass('badge-resus-active')
}

$(document).ready(function () {

});