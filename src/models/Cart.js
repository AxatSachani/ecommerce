const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({

    user_id: {
        type: ObjectId,
        required: true
    },
    products: [{
        type: Object,
        product_id: {
            type: ObjectId,
            required: true
        },
        seller_id: {
            type: ObjectId
        },
        product_name: {
            type: String
        },
        product_quantity: {
            type: Number,
            default: 1
        },
        product_size: {
            type: String,
            required: true
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