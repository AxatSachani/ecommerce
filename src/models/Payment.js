const { ObjectId } = require('bson')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const PaymentSchema = new mongoose.Schema({

    order_id: {
        type: ObjectId,
        required: true,
    },
    card_number: {
        type: String,
        required: true,
        trim: true
    },
    cvv_number: {
        type: String,
        required: true,
        trim: true
    },
    expiry_month: {
        type: String,
        required: true,
        trim: true
    },
    expiry_year: {
        type: String,
        required: true,
        trim: true
    },
    currency: {
        type: String
    },
    striperCustomer: {
        type: String
    },
    citent_secret: {
        type: String
    },
    source: {
        type: String
    },
    payment_method: {
        type: String
    },
    payment_intent: {
        type: String
    },
    created: {
        type: String,
    }
    // status:{
    //     type:Boolean
    // }
}
)

PaymentSchema.pre('save', async function (next) {
    const paymentDetails = this
    const cardNumber = paymentDetails.card_number
    paymentDetails.card_number = await cardNumber.toString().substr(-4);
    next()
})

const Payment = mongoose.model('Payment', PaymentSchema)
module.exports = Payment