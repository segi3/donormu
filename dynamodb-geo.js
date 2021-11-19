const AWS = require('aws-sdk')

// https://www.npmjs.com/package/dynamodb-geo

AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const ddb = new AWS.DynamoDB()

const ddbGeo = require('dynamodb-geo')
const config = new ddbGeo.GeoDataManagerConfiguration(ddb, 'MyGeoTable')

// query manager
const myGeoTableManager = new ddbGeo.GeoDataManager(config)

const createTable = () => {

    // Pick a hashKeyLength appropriate to your usage
    config.hashKeyLength = 6

    config.region = process.env.AWS_DEFAULT_REGION

    // Use GeoTableUtil to help construct a CreateTableInput.
    const createTableInput = ddbGeo.GeoTableUtil.getCreateTableRequest(config)

    // Tweak the schema as desired
    createTableInput.ProvisionedThroughput.ReadCapacityUnits = 2

    console.log('Creating table with schema:')
    console.dir(createTableInput, {
        depth: null
    })

    // Create the table
    ddb.createTable(createTableInput).promise()
        // Wait for it to become ready
        .then(function () {
            return ddb.waitFor('tableExists', {
                TableName: config.tableName
            }).promise()
        })
        .then(function () {
            console.log('Table created and ready!')
        });
}

const randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const addData = (newdata) => {

    const key = {
        S: String(randomInt(1000, 9999))
    }

    const geo = {
        latitude: newdata.latitude,
        longitude: newdata.longitude
    }
    
    const personData = {
        provinsi: {
            S: String(newdata.person.provinsi)
        },
        kota: {
            S: String(newdata.person.kota)
        },
        name: {
            S: String(newdata.person.name)
        },
        age: {
            S: String(newdata.person.age)
        },
        goldarah: {
            S: String(newdata.person.goldarah)
        },
        resus: {
            S: String(newdata.person.resus)
        },
        nohp: {
            S: String(newdata.person.nohp)
        },
        email: {
            S: String(newdata.person.email)
        },
        alamat: {
            S: String(newdata.person.alamat)
        },
        beratBadan: {
            S: String(newdata.person.beratBadan)
        },
        tinggiBadan: {
            S: String(newdata.person.tinggiBadan)
        }
    }

    console.log(key)
    console.log(geo)
    console.log(personData)

    // add data
    myGeoTableManager.putPoint({
        RangeKeyValue: key, // Use this to ensure uniqueness of the hash/range pairs.
        GeoPoint: geo,
        PutItemInput: { // Passed through to the underlying DynamoDB.putItem request. TableName is filled in for you.
            Item: personData,
        }
    }).promise()
    .then(function() { console.log('Done!') });
}

const updateData = () => {
    // update data
    myGeoTableManager.updatePoint({
        RangeKeyValue: { S: '1234' },
        GeoPoint: { // An object specifying latitutde and longitude as plain numbers.
            latitude: -6.0947972, // ini nya juga harus sama
            longitude: 106.150242
        },
        UpdateItemInput: { // TableName and Key are filled in for you
            UpdateExpression: 'SET country = :newName',
            ExpressionAttributeValues: {
                ':newName': { S: 'United Kingdom'}
            }
        }
    }).promise()
    .then(function() { console.log('Done!') });
}

const deleteData = () => {

    myGeoTableManager.deletePoint({
        RangeKeyValue: { S: '1234' },
        GeoPoint: { // An object specifying latitutde and longitude as plain numbers.
            latitude: -6.0947972, // ini nya juga harus sama
            longitude: 106.150242
        }
    }).promise()
    .then(function() { console.log('Done!') });
}

const radiusQuery = async (coords, radius) => {

    const rad = 100000 // 100km

    const centerCoords = {
        latitude: coords.latitude,
        longitude: coords.longitude
    }

    try {
        // Querying 100km from Cambridge, UK
        const result = await myGeoTableManager.queryRadius({
            RadiusInMeter: rad,
            CenterPoint: {
                latitude: parseFloat(centerCoords.latitude),
                longitude: parseFloat(centerCoords.longitude)
            }
        })
        
        return result

    } catch (err) {
        console.log(err)
        throw err
    }

}

// createTable()
// addData()
// radiusQuery()

module.exports = {
    radiusQuery,
    addData
}