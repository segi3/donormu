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

const addData = () => {
    // add data
    myGeoTableManager.putPoint({
        RangeKeyValue: { S: '1527' }, // Use this to ensure uniqueness of the hash/range pairs.
        GeoPoint: { // An object specifying latitutde and longitude as plain numbers. Used to build the geohash, the hashkey and geojson data
            latitude: -6.111704,
            longitude: 106.147299
        },
        PutItemInput: { // Passed through to the underlying DynamoDB.putItem request. TableName is filled in for you.
            Item: { // The primary key, geohash and geojson data is filled in for you
                country: { S: 'UK' }, // Specify attribute values using { type: value } objects, like the DynamoDB API.
                capital: { S: 'London' },
                name: {S: 'rafi nizar'},
                age: { S: '21'}
            },
            // ... Anything else to pass through to `putItem`, eg ConditionExpression
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

const radiusQuery = () => {
    // Querying 100km from Cambridge, UK
    myGeoTableManager.queryRadius({
        RadiusInMeter: 100000,
        CenterPoint: {
            latitude: -6.111720,
            longitude: 106.147299
        }
    })
    // Print the results, an array of DynamoDB.AttributeMaps
    .then((result) => {
        console.log(result)
    });
}

// createTable()
// addData()
// radiusQuery()

module.exports = {

}