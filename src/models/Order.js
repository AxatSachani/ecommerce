const { ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");

const OrderSchema = new mongoose.Schema({

    user_id: {
        type: ObjectId
    },
    user_name: {
        type: String
    },
    user_emailId: {
        type: String
    },
    user_contact: {
        type: Number
    },
    products: [{
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
            type: Number
        },
        product_price: {
            type: Number
        },
        amount: {
            type: Number
        }
    }],
    total_amount: {
        type: Number
    },
    billAddress: {
        type: String
    },
    shippAddress: {
        type: String
    }

})

const Order = mongoose.model('Order', OrderSchema)
module.exports = Order