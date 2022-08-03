const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const moment = require('moment')

const ItemSchema = new mongoose.Schema({

    item_type: {
        type: String,
        required: true,
        trim: true
    },
    addedBy: {
        type: ObjectId,
        required: true,
    },
    slug: {
        type: String,
        required:true
    },
    createAt: {
        type: String,
        default: moment(Date.now()).format('DD/MM/YYYY hh:mm a')
    },
    updateAt: {
        type: String,
        default: moment(Date.now()).format('DD/MM/YYYY hh:mm a')
    }
})

// filter response data
ItemSchema.methods.toJSON = function () {
    const item = this
    const itemData = item.toObject()
    delete itemData.addedBy
    delete itemData.__v
    return itemData
}

const Items = mongoose.model('Items', ItemSchema)
module.exports = Items