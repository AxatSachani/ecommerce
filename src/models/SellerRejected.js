const mongoose = require("mongoose");
const validator = require('validator')
const bcrypt = require('bcrypt')
const moment = require('moment');
const { ObjectId } = require("mongodb");

const SellerRejectedSchema = new mongoose.Schema({
    _id: {
        type: ObjectId,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    store_name: {
        type: String
    },
    address: {
        address: {
            type: String,
        },
        pincode: {
            type: String,
        },
        locality: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        }
    },
    document: {
        type: Array
    },
    emailId: {
        type: String,
        required: true
    },
    contact_no: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    remark: {
        type: String
    },
    rejectedAt: {
        type: String,
        default: moment(Date.now()).format('DD-MM-YYYY hh:mm a')
    }
})



// filter response data
SellerRejectedSchema.methods.toJSON = function () {
    const seller = this
    const sellerData = seller.toObject()
    delete sellerData.tokens
    delete sellerData.__v
    return sellerData
}

const SellerRejected = mongoose.model('SellerRejected', SellerRejectedSchema)
module.exports = SellerRejected