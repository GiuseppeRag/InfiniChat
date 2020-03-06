const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventLog = new Schema({
        eventName: {
            type: String
        },
        description: {
            type: String
        },
        user: {
            type: String
        },
        statusCode: {
            type: String
        },
        date: {
            type: Date
        },
        timestamp: {
            type: Date
        }
    },
    {
        collection: 'eventlog'
    });

module.exports = mongoose.model('EventLog', EventLog);
