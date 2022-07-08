const express = require("express");
const { ShippingAddress } = require("../models/Address");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const OrderHistory = require("../models/OrderHistory");
const Product = require("../models/Product");
const User = require("../models/User");
const Invoice = require("../models/Invoice");
const auth = require("../middleware/Auth");
const router = express.Router()

// place order
router.post('/user/order', auth, async (req, res) => {
    const user_id = req.body.user_id
    const cart_id = req.body.cart_id
    const msg = 'Order Placed'
    var code = process.env.OFFER20OFF
    var total_amount = 0, status = 'Miss/Mrs.', user_name, couponCode, dicount, payable_amount, requireAmount
    try {
    

        // user details
        const user = await User.findById(user_id)
        if(!user){
            throw new Error(`User not found`)
        }
        if (user.gender == 'male') {
            status = 'Mr.'
        }
        user_name = ` ${user.first_name} ${user.last_name}`
        const user_emailId = user.emailId
        const user_contact = user.contact_no
        const billAddress = user.address

        //address
        const user_shippAddress = await ShippingAddress.findOne({ user_id })
        const shippAddress = user_shippAddress.address

        // products data
        const cart = await Cart.findById(cart_id)
        if (!cart) {
            throw new Error('Cart not found')
        }
        for (var i = 0; i < cart.products.length; i++) {
            total_amount += cart.products[i].amount
        }
        payable_amount = total_amount

        // checkl for code
        couponCode = req.body.code
        if (couponCode) {
            if (code.indexOf(couponCode.toUpperCase()) !== -1) {
                if (10000 < total_amount) {
                    dicount = (total_amount * 20) / 100
                    payable_amount = total_amount - dicount
                } else {
                    requireAmount = 10000 - total_amount
                    throw new Error(`Amount atleast 10000 for code: ${couponCode}, Required ${requireAmount} more for this offer`)
                }
            } else {
                throw new Error(`Invalid coupon code`)
            }
        }


        // check stock
        for (var i = 0; i < cart.products.length; i++) {
            const cart_quantity = cart.products[i].product_quantity
            const product = await Product.findById(cart.products[i].product_id)
            const product_quantity = product.quantity
            if (cart_quantity > product_quantity) {
                throw new Error(`${product.product_details.name}: Available Qauntity : ${product_quantity}`)
            } if (product_quantity == 0) {
                throw new Error(`${product.product_details.name}: Out Of Stock`)
            }
        }

        const products = cart.products
        const OrderDetails = { user_id, user_name, user_emailId, user_contact, products, total_amount, couponCode, dicount, payable_amount, billAddress, shippAddress }

        // save order
        const order = await Order(OrderDetails)
        await order.save()

        // increase quantity from products data
        for (var i = 0; i < cart.products.length; i++) {
            const cart_quantity = cart.products[i].product_quantity
            const product = await Product.findById(cart.products[i].product_id)
            product.quantity -= cart_quantity
            await product.save()
        }

        //delete cart
        await Cart.findByIdAndDelete(cart_id)

        // save in history data
        var order_id = order._id
        const OrderHistoryDetails = { order_id, user_id, user_name, user_emailId, user_contact, products, total_amount, couponCode, dicount, payable_amount, billAddress, shippAddress }
        await OrderHistory(OrderHistoryDetails).save()


        res.status(201).send({ code: 201, message: msg, data: order })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})



// generate invoice
router.post('/user/order/invoice/:id', auth, async (req, res) => {
    const msg = 'Invoice generate'
    const order_id = req.params.id
    var status = 'Mr.'
    try {

        // order data
        const orderData = await Order.findById(order_id)
        if(!orderData){
            throw new Error('invalid order id')
        }
        const user_id = orderData.user_id
        var user_name = orderData.user_name
        const user_emailId = orderData.user_emailId
        const user_contact = orderData.user_contact
        const total_amount = orderData.total_amount
        const dicount = orderData.dicount
        const payable_amount = orderData.payable_amount
        const billAddress = orderData.billAddress
        const shippAddress = orderData.shippAddress

        const user = await User.findById(user_id)
        if (user.gender == 'female') {
            status = 'Miss/Mrs.'
        }

        // product data
        var productDetails = []
        user_name = `${status}${user_name}`
        for (var i = 0; i < orderData.products.length; i++) {
            const product = await orderData.products[i]
            const product_name = product.product_name
            const product_quantity = product.product_quantity
            const product_price = product.product_price
            const amount = product.amount
            const data = { product_name, product_quantity, product_price, amount }
            productDetails.push(data)
        }

        const InvoiceDetails = { order_id, user_name, user_emailId, user_contact, products: productDetails, total_amount, dicount, payable_amount, billAddress, shippAddress }
        if (orderData.payment == 'success') {
            var invoice = await Invoice(InvoiceDetails)
            await invoice.save()
        } else {
            throw new Error('Payment not succesed')
        }
        res.status(201).send({ code: 201, message: msg, data: invoice })
    } catch (error) {
        res.status(404).send({ code: 404, message: error.message })
    }
})


// user order history
router.get('/user-orders/:id', auth, async (req, res) => {
    const user_id = req.params.id
    const msg = 'User order history'
    try {
        const user = await User.findById(user_id)
        if (!user) {
            throw new Error('User not found')
        }
        const orders = await OrderHistory.find({ user_id }).select({ _id: 0, user_name: 0, user_emailId: 0, user_contact: 0, })

        res.status(200).send({ code: 200, message: msg, orders: orders })
    } catch (error) {
        res.status(404).send({ code: 404, message: error.message })
    }
})

module.exports = router