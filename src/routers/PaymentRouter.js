const express = require("express");
const moment = require('moment')
const router = express.Router()
const Payment = require('../models/Payment')
const Order = require('../models/Order');
const OrderHistory = require("../models/OrderHistory");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


router.post('/order/payment/:id', async (req, res) => {
    const msg = 'Payment done'
    const order_id = req.params.id
    const card_number = req.body.card_number
    const cvv_number = req.body.cvv_number
    const expiry_month = req.body.expiry_month
    const expiry_year = req.body.expiry_year
    try {
        const orderData = await Order.findById(order_id)
        // const amount = orderData.payable_amount

        const stripeCustomer = await stripe.customers.create({
            email: orderData.user_emailId,
            name: orderData.name
        })
        console.log('customer');
        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: req.body.card_number,
                exp_month: req.body.expiry_month,
                exp_year: req.body.expiry_year,
                cvc: req.body.cvv_number
            }
        })
        console.log('card');
        const paymentIntent = await stripe.paymentIntents.create({
            payment_method: paymentMethod.id,
            amount: orderData.payable_amount * 100,
            currency: 'inr',
            payment_method_types: ['card'],
            customer: stripeCustomer.id
        })
        console.log('payment');

        const confirmpaymentIntent = await stripe.paymentIntents.confirm(
            `${paymentIntent.id}`
        )
        console.log('payment done');

        const currency = confirmpaymentIntent.currency
        const striperCustomer = confirmpaymentIntent.customer
        const clinet_secret = confirmpaymentIntent.clinet_secret
        const source = confirmpaymentIntent.next_action.use_stripe_sdk.source
        const payment_method = confirmpaymentIntent.payment_method
        const payment_intent = confirmpaymentIntent.id
        const redirectLink = confirmpaymentIntent.next_action.use_stripe_sdk.stripe_js
        const created = moment(confirmpaymentIntent.created).format('DD/MM/YYYY hh:mm A')

        const paymentData = { order_id, card_number, cvv_number, expiry_month, expiry_year, currency, striperCustomer, clinet_secret, source, payment_method, payment_intent, created }

        const paymentDetails = await Payment(paymentData)
        await paymentDetails.save()
        await Order.findByIdAndUpdate(order_id, { payment: 'success' })
        await OrderHistory.findOneAndUpdate({ order_id }, { payment: 'success' })
        res.status(200).send({ code: 200, message: msg, data: paymentDetails, redirectLink })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})


module.exports = router