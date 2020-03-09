const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventLog = new Schema({
        eventName: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        user: {
            type: String,
            required: true,
            default: 'InfiniChat'
        },
        statusCode: {
            type: String
        },
        timestamp: {
            type: Date
        }
    },
    {
        collection: 'eventlog'
})

module.exports = mongoose.model('EventLog', EventLog);
