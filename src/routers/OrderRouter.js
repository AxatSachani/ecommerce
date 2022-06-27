const express = require("express");
const { ShippingAddress } = require("../models/Address");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const router = express.Router()

// place order
router.post('/order', async (req, res) => {
    const user_id = req.body.user_id
    const cart_id = req.body.cart_id
    var status, total_amount = 0
    try {

        // user details
        const user = await User.findById(user_id)
        if (user.gender == 'male') {
            status = 'Mr.'
        } else {
            status = 'Miss/Mrs.'
        }
        const user_name = `${status} ${user.first_name} ${user.last_name}`
        const user_emialId = user.emailId
        const user_contact = user.contact_no
        const billAddress = user.address

        const user_shippAddress = await ShippingAddress.findOne({ user_id })
        console.log(user_shippAddress);
        const shippAddress = user_shippAddress.address

        // products data
        const cart = await Cart.findById(cart_id)
        for (var i = 0; i < cart.products.length; i++) {
            total_amount += cart.products[i].amount
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
        const OrderDetails = { user_id, user_name, user_emialId, user_contact, products, total_amount, billAddress, shippAddress }
        console.log(OrderDetails);

        const order = await Order(OrderDetails)
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})

module.exports = router