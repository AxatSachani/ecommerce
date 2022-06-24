const mongoose = require("mongoose");
const validator = require('validator')
const bcrypt = require('bcrypt')
const moment = require('moment');
const { ObjectId } = require("mongodb");

const SellerRejectedSchema = new mongoose.Schema({
    _id:{
        type:ObjectId,
        required:true
    },
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    emailId: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email..')
            }
        }
    },
    contact_no: {
        type: Number,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (value.length < 6) {
                throw new Error('password must be contain atleast 6 characters')
            } else if (value.toLowerCase().includes('password')) {
                throw new Error(`Password can not contain ${value}`)
            } else if (value.endsWith(' ')) {
                throw new Error(`Password can not end with space (' ') `)
            }
        }
    },
    reject_reason: {
        type: String
    },
    rejectedAt: {
        type: String,
        default: moment(Date.now()).format('DD-MM-YYYY hh:mm a')
    }
})


const SellerRejected = mongoose.model('SellerRejected', SellerRejectedSchema)
module.exports = SellerRejected