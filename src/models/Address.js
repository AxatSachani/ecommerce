const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const BillingAddressSchema = new mongoose.Schema({
    user_id: {
        type: ObjectId
    },
    address: {
        type: String
    }

})
const BillingAddress = mongoose.model('BillingAddress',BillingAddressSchema)
// module.exports = 


const ShippingAddressSchema = new mongoose.Schema({
    user_id: {
        type: ObjectId
    },
    address: {
        type: String
    }
})

const ShippingAddress = mongoose.model('ShippingAddress',ShippingAddressSchema)
module.exports = {
    BillingAddress,
    ShippingAddress}