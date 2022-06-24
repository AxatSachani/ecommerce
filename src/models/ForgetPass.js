const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const validator = require('validator')

const ForgetPassSchema = new mongoose.Schema({
    emailId: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid EmailID')
            }
        }
    },
    seller_id: {
        type: ObjectId,
    },
    otp:{
        type:Number
    },
    time:{
        type:Number,
        default:Date.now()
    }
})

const ForgetPassword = mongoose.model('ForgetPassword', ForgetPassSchema)
module.exports = ForgetPassword
