const mongoose = require("mongoose");
const validator = require('validator')
const bcrypt = require('bcrypt');
const { ObjectId } = require("mongodb");
const jwt = require('jsonwebtoken')
const moment = require('moment')

const SellerSchema = new mongoose.Schema({
    _id: {
        type: ObjectId,
        required: true,
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

    remark: {
        type: String
    },
    date: {
        type: String,
        default: moment(Date.now()).format('DD/MM/YYYY hh:mm a')
    },
    tokens: [{
        token: {
            type: String
        }
    }]
})


// filter response data
SellerSchema.methods.toJSON = function () {
    const seller = this
    const sellerData = seller.toObject()
    delete sellerData.password
    delete sellerData.tokens
    delete sellerData.__v
    return sellerData
}


// change password into bcrypt
SellerSchema.pre('save', async function (next) {
    const seller = this
    if (seller.isModified('password')) {
        seller.password = await bcrypt.hash(seller.password, 8)
    }
    next()
})

// check login data
SellerSchema.statics.findByCredentials = async function (emailId, password) {
    const seller = await Seller.findOne({ emailId })
    if (!seller) {
        throw new Error('seller not found')
    } else {
        const isMatch = await bcrypt.compare(password, seller.password)
        if (!isMatch) {
            throw new Error('Wrong Password')
        }
        return seller
    }
}

// generate token
SellerSchema.methods.generateAuthToken = async function () {
    const seller = this
    const token = jwt.sign({ _id: seller._id.toString() }, 'token')
    seller.tokens = seller.tokens.concat({ token })
    await seller.save()
    return token
}


const Seller = mongoose.model('Seller', SellerSchema)
module.exports = Seller