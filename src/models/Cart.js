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
        product_brand: {
            type: String
        },
        product_name: {
            type: String
        },
        product_banner: {
            type: String
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
    subtotal:{
        type:Number,
        default:0
    },
    discount:{
        type:Number,
        default:0
    },
    total_amount:{
        type:Number,
        default:0
    }



})
const Cart = mongoose.model('Cart', CartSchema)
module.exports = Cart