const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const History = new Schema({
     user: {
         type: String,
         required: true
     },
    message: {
         type: String,
         required: true
    },
    room: {
         type: String,
         required: true
    },
    timestamp: {
         type: Date
    }
},
    {
    collection: 'history'
})

module.exports = mongoose.model('History', History);
