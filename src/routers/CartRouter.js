const express = require("express");
const router = express.Router()
const Cart = require('../models/Cart')
const Product = require('../models/Product')


// add cart
router.post('/add/cart', async (req, res) => {
    const msg = 'Cart added'
    const user_id = req.body.user_id
    const product_id = req.body.product_id
    const product_size = req.body.product_size
    var productDetails, seller_id, product_name, product_price, amount, cartData, cart
    try {
        const cartCheck = await Cart.findOne({ user_id })
        console.log('checkCart:', cartCheck);
        if (!cartCheck) {
            productDetails = await Product.findById(product_id)
            seller_id = productDetails.seller_id
            product_name = productDetails.product_details.name
            product_price = productDetails.product_price
            amount = product_price * 1
            cartData = { user_id, products: { product_id, seller_id, product_name, product_size, product_price, amount }, }
            cart = await Cart(cartData)
            await cart.save()
            console.log('cart:', cart);
        }
        productDetails = await Product.findById(product_id)
        seller_id = productDetails.seller_id
        product_name = productDetails.product_details.name
        product_price = productDetails.product_price
        amount = product_price * 1
        cartData = { product_id, seller_id, product_name, product_size, product_price, amount }
        cartCheck.products.add(cartData)
        console.log('here', cartData);
        await Cart.update(
            { "_id": "100" },
            {
                $push: {
                    animalArray: "cat"
                }
            }
        )
        await cartCheck.save()


        res.status(201).send({ code: 201, message: msg, data: cart })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})


module.exports = router