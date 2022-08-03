const { ObjectId } = require("mongodb");
const { default: mongoose, now } = require("mongoose");
const moment = require('moment')

const InvoiceSchema = new mongoose.Schema({

    order_id: {
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
    dicount: {
        type: Number
    },
    payable_amount: {
        type: Number
    },
    address: {
        address: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true,
        },
        locality: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        }
    },
    order_time: {
        type: String,
        default: moment(Date.now()).format('DD/MM/YYYY hh:mm A')
    }

})

const Invoice = mongoose.model('Invoice', InvoiceSchema)
module.exports = Invoice