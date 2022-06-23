const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const moment = require('moment')

const ItemSchema = new mongoose.Schema({
    item_type: {
        type: String,
        required: true,
        trim: true,
        uppercase:true
    },
    addedBy: {
        type: ObjectId,
        required: true,
    },
    createAt: {
        type: String,
        default: moment(Date.now()).format('DD/MM/YYYY hh:mm a')
    },
})
const Items = new mongoose.model('Items', ItemSchema)
module.exports = Items