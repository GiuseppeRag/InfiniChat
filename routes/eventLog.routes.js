const express = require('express')
const eventLogRoute = express()
const EventLogSchema = require('../models/eventLog')

eventLogRoute.route('/api/addevent').get((req, res, next) => {
    EventLogSchema.create(req.body, (error, data) => {
        if (error){
            console.log(`Could not add event because of an error: ${error}`)
            return next(error)
        }
        else {
            console.log('event added successfully')
            res.json(data)
        }
    })
})

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
    }).sort({timestamp: descending, date: descending})
})

module.exports = eventLogRoute