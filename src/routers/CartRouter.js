const express = require("express");
const router = express.Router()
const Cart = require('../models/Cart')
const Product = require('../models/Product');
const User = require("../models/User");


// add cart
router.post('/add/cart', async (req, res) => {
    const msg = 'Cart added'
    const user_id = req.body.user_id
    const product_id = req.body.product_id
    const product_size = req.body.product_size
    var productDetails, seller_id, product_name, product_price, amount, cartData, cart, product_quantity = 1
    try {
        productDetails = await Product.findById(product_id)
        seller_id = productDetails.seller_id
        product_name = productDetails.product_details.name
        product_price = productDetails.product_price
        amount = product_price * product_quantity

        const cartCheck = await Cart.findOne({ user_id })
        if (!cartCheck) {
            cartData = { user_id, products: { product_id, seller_id, product_name, product_quantity, product_size, product_price, amount } }
            cart = await Cart(cartData)
            await cart.save()
            res.status(201).send({ code: 201, message: msg, data: cart })
        } else {
            cartData = { product_id, seller_id, product_name, product_quantity, product_size, product_price, amount }
            cartCheck.products.push(cartData)
            await cartCheck.save()
            res.status(201).send({ code: 201, message: msg, data: cartCheck })
        }
    } catch (error) {
        res.status(404).send({ code: 400, message: error.message })
    }
})


// update cart quantity-increase
router.patch('/update/cart/quantity-increase', async (req, res) => {
    try {
        const cart_id = req.body.cart_id
        const productCart_id = req.body.productCart_id
        var cart = await Cart.findById(cart_id)
        for (var i = 0; i < cart.products.length; i++) {
            const product = cart.products[i]._id == productCart_id
            if (product) {
                const product_quantity = cart.products[i].product_quantity += 1
                cart.products[i].amount = cart.products[i].product_price * product_quantity
                break;
            }
        }
        await cart.save()
        res.send(cart)
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})


// update cart quantity-decrease
router.patch('/update/cart/quantity-decrease', async (req, res) => {
    const msg = 'Cart updated'
    try {
        const cart_id = req.body.cart_id
        const productCart_id = req.body.productCart_id
        var cart = await Cart.findById(cart_id)
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
router.delete('/delete/cart-product', async (req, res) => {
    const cart_id = req.body.cart_id
    const product_number = req.body.product_number
    const msg = 'Cart updated'
    try {
        const cart = await Cart.findById(cart_id)
        cart.products.splice(product_number, 1)
        await cart.save()
        res.status(200).send({ code: 200, message: msg, data: cart })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})


// delete whole cart
router.delete('/delete/cart', async (req, res) => {
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
router.get('/get/user-cart', async (req, res) => {
    const msg = 'User Cart'
    try {
        const userCart = await User.aggregate([
            {
                $project: {
                    _id: 1
                }
            },
            {
                $lookup: {
                    from: Cart.collection.name,
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'CartDetails'
                },
            },
        ])
        const c = userCart[0].CartDetails[0].products.length
        res.status(200).send({ code: 200, message: msg, data: userCart })
    } catch (error) {
        res.status(404).send({ code: 404, message: error.message })
    }
})


module.exports = router