const express = require('express')
const historyRoute = express.Router()
const HistorySchema = require('../models/history')

historyRoute.route('/api/history').get((req, res, next) => {
    HistorySchema.find((error, data) => {
        if (error){
            console.log(`Could not retrieve history because of an error: ${error}`)
            return next(error)
        }
        else {
            console.log("history retrieved")
            res.json(data)
        }
    });
});

historyRoute.route('/api/roomhistory/:roomname').get((req, res, next) => {
    let roomName = req.params.roomname
    HistorySchema.find({room: roomName}, (error, data) => {
        if (error){
            console.log(`Could not retrieve history from room because of an error: ${error}`)
            return next(error)
        }
        else {
            console.log("history from room retrieved")
            res.json(data)
        }
    });
});

module.exports = historyRoute