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
    },
    addedBy: {
        type: ObjectId,
        required: true,
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
SubItemSchema.methods.toJSON = function () {
    const subItem = this
    const subItemData = subItem.toObject()
    delete subItemData.addedBy
    delete subItemData.__v
    return subItemData
}


const SubItems = mongoose.model('SubItems', SubItemSchema)
module.exports = SubItems