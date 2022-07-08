const express = require("express");
const auth = require("../middleware/Auth");
const router = express.Router()
const Cart = require('../models/Cart')
const Product = require('../models/Product');
const User = require("../models/User");


// add user cart
router.post('/user/add/cart', auth, async (req, res) => {
    const msg = 'Cart added'
    const user_id = req.body.user_id
    const product_id = req.body.product_id
    const product_size = req.body.product_size.toUpperCase()
    var productDetails, seller_id, product_details, product_price, amount, cartData, cart, product_quantity = 1
    try {
        const user = await User.findById(user_id)
        if (!user) {
            throw new Error(`User not found`)
        }
        productDetails = await Product.findById(product_id)
        if (!productDetails) {
            throw new Error(`Product not found`)
        }
        seller_id = productDetails.seller_id
        product_details = productDetails.product_details
        product_price = productDetails.product_price
        amount = product_price * product_quantity

        const cartCheck = await Cart.findOne({ user_id })
        if (!cartCheck) {
            cartData = { user_id, products: { product_id, seller_id, product_details, product_quantity, product_size, product_price, amount } }
            cart = await Cart(cartData)
            await cart.save()
            res.status(201).send({ code: 201, message: msg, data: cart })
        } else {
            cartData = { product_id, seller_id, product_details, product_quantity, product_size, product_price, amount }
            cartCheck.products.push(cartData)
            await cartCheck.save()
            res.status(201).send({ code: 201, message: msg, data: cartCheck })
        }
    } catch (error) {
        res.status(404).send({ code: 400, message: error.message })
    }
})


// update cart quantity-increase
router.patch('/user/cart/quantity-increase', auth, async (req, res) => {
    const msg = 'Cart updated'
    const user_id = req.body.user_id
    const productCart_id = req.body.productCart_id
    try {
        const user = await User.findById(user_id)
        if (!user) {
            throw new Error(`User not found`)
        }
        var cart = await Cart.findOne({ user_id })
        for (var i = 0; i < cart.products.length; i++) {
            const product = cart.products[i]._id == productCart_id
            if (product) {
                const product_quantity = cart.products[i].product_quantity += 1
                cart.products[i].amount = cart.products[i].product_price * product_quantity
                break;
            }
        }
        await cart.save()
        res.status(200).send({ code: 200, message: msg, data: cart })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})


// update cart quantity-decrease
router.patch('/user/cart/quantity-decrease', auth, async (req, res) => {
    const msg = 'Cart updated'
    const user_id = req.body.user_id
    const productCart_id = req.body.productCart_id
    try {
        const user = await User.findById(user_id)
        if (!user) {
            throw new Error(`User not found`)
        }
        var cart = await Cart.findOne({ user_id })
        for (var i = 0; i < cart.products.length; i++) {
            const product = cart.products[i]._id == productCart_id
            if (product) {
                const product_quantity = cart.products[i].product_quantity -= 1
                cart.products[i].amount = cart.products[i].product_price * product_quantity
                break;
            }
        }
        await cart.save()
        res.status(201).send({ code: 201, message: msg, data: cart })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})


// delete product from cart
router.delete('/user/cart-product/delete', auth, async (req, res) => {
    const user_id = req.body.user_id
    const productCart_id = req.body.productCart_id
    const msg = 'Cart updated'
    try {
        const cart = await Cart.findOne({ user_id })
        if (!cart) {
            throw new Error('cart not available')
        }
        for (var i = 0; i < cart.products.length; i++) {
            const product = cart.products[i]._id == productCart_id
            if (product) {
                cart.products.splice(i, 1)
                break;
            }
        }
        await cart.save()
        res.status(200).send({ code: 200, message: msg, data: cart })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})


// delete whole cart
router.delete('/user/cart/delete', auth, async (req, res) => {
    const user_id = req.body.user_id
    const msg = 'Cart deleted'
    try {
        const cart = await Cart.findOneAndDelete({ user_id })
        if (!cart) {
            throw new Error('Cart not found')
        }
        res.status(200).send({ code: 200, message: msg })
    } catch (error) {
        res.status(404).send({ code: 404, message: error.message })
    }
})

// get cartDetails by user 
router.get('/user/cart/:id', auth, async (req, res) => {
    const msg = 'User Cart'
    const user_id = req.params.id
    try {
        const user = await User.findById((user_id))
        if (!user) {
            throw new Error(`User not found`)
        }
        const userCart = await Cart.findOne({ user_id }).select({ user_id: 0 })
        res.status(200).send({ code: 200, message: msg, data: userCart })
    } catch (error) {
        res.status(404).send({ code: 404, message: error.message })
    }
})


module.exports = router