const express = require("express");
const { ShippingAddress } = require("../../models/Address");
const Cart = require("../../models/Cart");
const Order = require("../../models/Order");
const OrderHistory = require("../../models/OrderHistory");
const Product = require("../../models/Product");
const User = require("../../models/User");
const Invoice = require("../../models/Invoice");
const Payment = require('../../models/Payment')

const auth = require("../../middleware/Auth");
const router = express.Router()
const moment = require('moment')

var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const courier = require("@trycourier/courier").CourierClient({ authorizationToken: process.env.EMAIL_TOKEN });


var email = function (email, username, orderId) {
    courier.send({
        message: {
            to: {
                email: email,
            },
            template: "S9AAQTR888MNY9J0R92KC177TCWP",
            data: {
                username: username,
                orderId: orderId
            },
        },
    });
}


// place order
router.post('/user/order', auth, async (req, res) => {
    const user_id = req.body.user_id
    const cart_id = req.body.cart_id
    var paymentType = req.body.payment_type

    const card_number = req.body.card_number
    const cvv_number = req.body.cvv_number
    const expiry_month = req.body.expiry_month
    const expiry_year = req.body.expiry_year

    const msg = 'Order Placed'
    var total_amount, user_name, success, product, payment = paymentType, user_emailId, user_contact, products, OrderDetails
    console.log('order-place');
    try {
        const user = await User.findById(user_id)
        if (!user) {
            throw new Error(`User not found`)
        }
        if (!user.address.city) {
            throw new Error('Add address')
        }

        const cart = await Cart.findById(cart_id)
        if (!cart) {
            throw new Error('Cart not found')
        }

        // user data
        user_name = `${user.first_name} ${user.last_name}`
        user_emailId = user.emailId
        user_contact = user.contact_no
        const address = user.address

        total_amount = cart.total_amount
        products = cart.products
        OrderDetails = { user_id, user_name, user_emailId, user_contact, products, total_amount, payment, address }

        // save order
        const order = await Order(OrderDetails)

        var order_id = order._id
        const OrderHistoryDetails = { order_id, user_id, user_name, user_emailId, user_contact, products, total_amount, payment, address }
        var orderHistory = await OrderHistory(OrderHistoryDetails)


        if (paymentType == 'cash') {

            // save order
            await order.save()

            // increase livequantity from products data
            for (var i = 0; i < cart.products.length; i++) {
                const cart_quantity = cart.products[i].product_quantity
                const product = await Product.findById(cart.products[i].product_id)
                product.livequantity -= cart_quantity
                await product.save()
            }

            // delete cart
            // await Cart.findByIdAndDelete(cart_id)

            // save in history data
            await orderHistory.save()

            email(user_emailId, user_name, order_id)
            success = true
            res.status(201).send({ code: 201, success: success, message: msg, data: order_id })
        }

        // ------------------------------------------------------------------------------------------------------------------------------------ //

        // if CARD then this....
        else if (paymentType == 'card') {
            console.log('card');

            const stripeCustomer = await stripe.customers.create({
                email: user_emailId,
                name: user_name
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
                amount: total_amount * 100,
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
            await order.save()
            // increase livequantity from products data
            for (var i = 0; i < cart.products.length; i++) {
                const cart_quantity = cart.products[i].product_quantity
                product = await Product.findById(cart.products[i].product_id)
                product.livequantity -= cart_quantity
                await product.save()
            }

            //delete cart
            // await Cart.findByIdAndDelete(cart_id)
            await orderHistory.save()

            email(user_emailId, user_name, order_id)

            success = true
            res.status(201).send({ code: 201, success: success, message: msg, data: redirectLink, order_id })
        }
        else {
            throw new Error('choose paymnet type')
        }
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})



// generate invoice
router.post('/user/order/invoice/:id', auth, async (req, res) => {
    const msg = 'Invoice generate'
    const order_id = req.params.id
    var status = 'Mr.'
    var success
    console.log('order-invoice');
    try {

        // order data
        const orderData = await Order.findById(order_id)
        if (!orderData) {
            throw new Error('invalid order id')
        }
        const user_id = orderData.user_id
        var user_name = orderData.user_name
        const user_emailId = orderData.user_emailId
        const user_contact = orderData.user_contact
        const total_amount = orderData.total_amount
        const billAddress = orderData.billAddress
        const shippAddress = orderData.shippAddress

        const user = await User.findById(user_id)
        if (user.gender == 'female') {
            status = 'Miss/Mrs.'
        }

        // product data
        var productDetails = []
        user_name = `${status + user_name}`
        for (var i = 0; i < orderData.products.length; i++) {
            const product = await orderData.products[i]
            const product_name = product.product_name
            const product_quantity = product.product_quantity
            const product_price = product.product_price
            const amount = product.amount
            const data = { product_name, product_quantity, product_price, amount }
            productDetails.push(data)
        }

        const InvoiceDetails = { order_id, user_name, user_emailId, user_contact, products: productDetails, total_amount, billAddress, shippAddress }
        if (orderData.payment == 'card' || orderData.payment == 'cash') {
            var invoice = await Invoice(InvoiceDetails)
            await invoice.save()
        } else {
            throw new Error('Payment not succesed')
        }
        success = true
        res.status(201).send({ code: 201, success: success, message: msg, data: invoice })
    } catch (error) {
        success = false
        res.status(404).send({ code: 404, success: success, message: error.message })
    }
})



// user order history
router.get('/user-orders/:id', auth, async (req, res) => {
    const user_id = req.params.id
    const msg = 'User order history'
    var success
    console.log('order-user');
    try {
        const user = await User.findById(user_id)
        if (!user) {
            throw new Error('User not found')
        }
        const orders = await OrderHistory.find({ user_id }).select({ _id: 0, user_name: 0, user_emailId: 0, user_contact: 0, })

        success = true
        res.status(200).send({ code: 200, success: success, message: msg, orders: orders })
    } catch (error) {
        success = false
        res.status(404).send({ code: 404, success: success, message: error.message })
    }
})

module.exports = router