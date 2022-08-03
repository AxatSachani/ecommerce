const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const moment = require('moment')

const SubChildSchema = new mongoose.Schema({
    subChild_type: {
        type: String,
        required: true,
        trim: true,
    },
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

const SubChild = mongoose.model('SubChild', SubChildSchema)
module.exports = SubChild