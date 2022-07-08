const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({

    user_id: {
        type: ObjectId,
        required: true
    },
    products: [{
        product_id: {
            type: ObjectId,
            required: true
        },
        seller_id: {
            type: ObjectId
        },
        product_details: {
            type: Object
        },
        product_quantity: {
            type: Number
        },
        product_size: {
            type: String
        },
        product_price: {
            type: Number
        },
        amount: {
            type: Number
        }
    }],



})
const Cart = mongoose.model('Cart', CartSchema)
module.exports = Cart