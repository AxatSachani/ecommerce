const express = require("express");
const auth = require("../../middleware/Auth");
const router = express.Router()
const Cart = require('../../models/Cart');
const Coupon = require("../../models/Coupon");
const Product = require('../../models/Product');
const User = require("../../models/User");
// require('dotenv').config()


// add user cart 
router.post('/user/add/cart', auth, async (req, res) => {
    const msg = 'Cart added'
    const user_id = req.body.user_id
    const product_id = req.body.product_id
    const product_size = req.body.product_size.toUpperCase()
    var productDetails, seller_id, product_brand, product_name, product_banner, product_price, amount, cartData, cart, product_quantity = 1
    var success
    console.log('cart-add');
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
        product_brand = productDetails.product_details.name
        product_name = productDetails.product_details.description
        product_banner = productDetails.product_details.banner
        product_price = productDetails.product_price
        amount = product_price * product_quantity


        const cartCheck = await Cart.findOne({ user_id })
        if (!cartCheck) {
            cartData = { user_id, products: { product_id, seller_id, product_brand, product_name, product_banner, product_quantity, product_size, product_price, amount } }
            cart = await Cart(cartData)
            await cart.save()
            res.status(201).send({ code: 201, message: msg, data: cart })
        } else {
            cartData = { product_id, seller_id, product_brand, product_name, product_banner, product_quantity, product_size, product_price, amount }
            cartCheck.products.push(cartData)
            await cartCheck.save()
            success = true
            res.status(201).send({ code: 201, success: success, message: msg, data: cartCheck })
        }
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


// update cart quantity-increase
router.put('/user/cart/quantity-increase', auth, async (req, res) => {
    const msg = 'Cart updated'
    const user_id = req.body.user_id
    const productCart_id = req.body.productCart_id
    var success
    console.log('cart-qua-+');
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
        success = true
        res.status(200).send({ code: 200, success: success, message: msg })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


// update cart quantity-decrease
router.put('/user/cart/quantity-decrease', auth, async (req, res) => {
    const msg = 'Cart updated'
    const user_id = req.body.user_id
    const productCart_id = req.body.productCart_id
    var success
    console.log('cart-qua--');
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
        success = true
        res.status(200).send({ code: 200, success: success, message: msg })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


// delete product from cart
router.put('/user/cart-product/delete', auth, async (req, res) => {
    const user_id = req.body.user_id
    const productCart_id = req.body.productCart_id
    const msg = 'Cart updated'
    var success
    console.log('cart-pro-del');
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
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: cart })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


// delete whole cart
router.put('/user/cart/delete', auth, async (req, res) => {
    const user_id = req.body.user_id
    const msg = 'Cart deleted'
    var success
    console.log('cart-del');
    try {
        const cart = await Cart.findOneAndDelete({ user_id })
        if (!cart) {
            throw new Error('Cart not found')
        }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg })
    } catch (error) {
        success = false
        res.status(404).send({ code: 404, success: success, message: error.message })
    }
})

// get cartDetails by user 
router.get('/user/cart/:id', auth, async (req, res) => {
    const msg = 'User Cart'
    const user_id = req.params.id
    var success
    console.log('cart');
    try {
        const user = await User.findById((user_id))
        if (!user) {
            throw new Error(`User not found`)
        }
        const userCart = await Cart.findOne({ user_id }).select({ user_id: 0 })
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: userCart })
    } catch (error) {
        success = false
        res.status(404).send({ code: 404, success: success, message: error.message })
    }
})

// var num3 = 00.toFixed(2);
// console.log(num3);


// var a = process.env.OFFER20OFF.split(', ')
// console.log(a);
// console.log(a[1]);



// check out details
router.post('/user/cart/checkout', auth, async (req, res) => {
    var success, subtotal = 0, total = 0, discount = 00
    const user_id = req.body.user_id
    const couponCode = req.body.code
    const msg = 'checkout data'
    console.log('cart checkout');
    try {
        const checkout = await Cart.findOne({ user_id })
        if (!checkout) {
            throw new Error('Cart not found')
        }
        for (var i = 0; i < checkout.products.length; i++) {
            subtotal += checkout.products[i].amount
        }
        total = subtotal
        if (couponCode) {
            const coupon = await Coupon.findOne({ coupon_code: couponCode })     //.select({ coupon_type: 1, discount: 1, condition: 1 })
            if (!coupon) {
                throw new Error('invalid coupon code')
            }
            if (coupon.coupon_type == 'Flat Discount') {
                if (coupon.condition < subtotal) {
                    discount = coupon.discount
                    total = subtotal - discount
                } else {
                    requireAmount = coupon.condition - subtotal
                    throw new Error(`${requireAmount} more require`)
                }
            }
            else {
                const validDiscount = (coupon.discount).split('%')
                if (coupon.condition < subtotal) {
                    discount = (subtotal * validDiscount[0]) / 100
                    total = subtotal - discount
                } else {
                    requireAmount = coupon.condition - subtotal
                    throw new Error(`${requireAmount} more require`)
                }
            }
        }
        const cartData = { couponCode, subtotal, discount, total }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: cartData })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})



// order checkout
router.post('/user/order-checkout', auth, async (req, res) => {
    const user_id = req.body.user_id
    const cart_id = req.body.cart_id
    const subtotal = req.body.subtotal
    const discount = req.body.discount
    const total_amount = req.body.total_amount

    const msg = 'order data'
    var productData = [], items = 0, product_price
    console.log('/user/order-checkout');
    try {
        // user details
        const user = await User.findById(user_id)
        if (!user) {
            throw new Error(`User not found`)
        }
        // products data
        const cart = await Cart.findById(cart_id)
        if (!cart) {
            throw new Error('Cart not found')
        }
        await Cart.findByIdAndUpdate(cart_id, { subtotal, discount, total_amount })

        for (var i = 0; i < cart.products.length; i++) {
            product_brand = cart.products[i].product_brand
            product_name = cart.products[i].product_name
            product_banner = cart.products[i].product_banner
            product_price = cart.products[i].amount
            items += cart.products[i].product_quantity
            const details = { product_brand, product_name, product_banner, product_price }
            productData.push(details)
        }

        // check stock
        for (var i = 0; i < cart.products.length; i++) {
            const cart_quantity = cart.products[i].product_quantity
            const product = await Product.findById(cart.products[i].product_id)
            const product_livequantity = product.livequantity
            if (cart_quantity > product_livequantity) {
                throw new Error(`${product.product_name}: Available Qauntity : ${product_livequantity}`)
            } if (product_livequantity == 0) {
                throw new Error(`${product.product_name}: Out Of Stock`)
            }
        }
        const sub_total = cart.subtotal
        const _discount = cart.discount
        const _total_amount = cart.total_amount
        const orderCheckout = { user_id, cart_id, productData, items, sub_total, _discount, _total_amount }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: orderCheckout })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})



module.exports = router