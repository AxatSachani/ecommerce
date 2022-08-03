const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
    user_id: {
        type: ObjectId
    },
    address: {
        default:"",
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
})

const Address = mongoose.model('Address',AddressSchema)
module.exports = Address