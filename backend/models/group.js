const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const groupSchema = new Schema({
    name: String,
    devices: [],
    state: Boolean,
    log: [{
        date: String,
        action: String
    }]
})

const groupModel = mongoose.model('group', groupSchema);

module.exports = groupModel;