const mongoose = require("mongoose");
const validator = require('validator')
const bcrypt = require('bcrypt');
const { ObjectId } = require("mongodb");

const SellerRequestSchema = new mongoose.Schema({

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
    document: {
        type: String
    }
})

SellerRequestSchema.pre('save', async function (next) {
    const seller = this
    if (seller.isModified('password')) {
        seller.password = await bcrypt.hash(seller.password, 8)
    }
    next()
})

const SellerRequest = mongoose.model('SellerRequest', SellerRequestSchema)
module.exports = SellerRequest