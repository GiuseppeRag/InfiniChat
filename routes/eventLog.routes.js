const express = require('express')
const eventLogRoute = express()
const EventLogSchema = require('../models/eventLog')

//route to retrieve all logs
eventLogRoute.route('/api/eventlog').get((req, res, next) => {
    EventLogSchema.find((error, data) => {
        if (error){
            console.log(`Could not retrieve event log because of an error: ${error}`)
            return next(error)
        }
        else {
            console.log("event log retrieved")
            res.json(data)
        }
    }).sort({timestamp: 1, date: 1})
})

module.exports = eventLogRoute