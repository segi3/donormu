var map2, curLong2, curLat2

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

            map2 = new mapboxgl.Map({
                container: 'map2',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [curLong, curLat],
                // center: [106.150289, -6.094634],
                zoom: 17
            });

            map2.on('load', function () {
                map2.on('click', function (e) {
                    var coordinates = e.lngLat
                    console.log(coordinates)
                    $('#inputLong').val(coordinates.lng)
                    $('#inputLat').val(coordinates.lat)
                });
            });

        }, () => {
            // error
            console.log("ERROR")

        }, {
            enableHighAccuracy: true
        })

    });

$(document).ready(function () {
    $('#input-cancel').on('click', (e) => {
        $('#input-modal').toggle()
    })
    $('#jadi-pendonor').on('click', () => {
        $('#input-modal').toggle()
    })

    $('body').on('submit', '#new-pendonor-form', (e) => {
        e.preventDefault()

        const person = {
            provinsi: 'banten',
            kota: 'serang',
            name: $('#namePendonor').val(),
            age: $('#umurPendonor').val(),
            goldarah: $('#selectGolDarahPendonor').val(),
            resus: $('#selectResusPendonor').val(),
            nohp: $('#nohpPendonor').val(),
            email: $('#emailPendonor').val(),
            alamat: 'alamat',
            beratBadan: $('#tinggiBadanPendonor').val(),
            tinggiBadan: $('#beratBadanPendonor').val()
        }

        const dataN = {
            latitude: $('#inputLat').val(),
            longitude: $('#inputLong').val(),
            person: person
        }

        console.log(dataN)

        $.ajax({
            url: "/api/addPendonor",
            method: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(dataN),
            success: function (response) {
                console.log(response)
                $('#input-modal').hide()
                location.reload()
            },
            error: function () {
                alert("error");
            }

        });
    })
});