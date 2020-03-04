const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const History = new Schema({
     user: {
         type: String
     },
    message: {
         type: String
    },
    room: {
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
    collection: 'history'
    });

module.exports = mongoose.model('History', History);
