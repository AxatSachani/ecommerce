const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const moment = require('moment')

const SubItemSchema = new mongoose.Schema({
    subItem_type: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    item_type: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    addedBy: {
        type: ObjectId,
        required: true,
    },
    createAt: {
        type: String,
        default: moment(Date.now()).format('DD/MM/YYYY hh:mm a')
    },
    lastUpdate: {
        type: String,
        default: moment(Date.now()).format('DD/MM/YYYY hh:mm a')
    }
})

const SubItems = mongoose.model('SubItems', SubItemSchema)
module.exports = SubItems