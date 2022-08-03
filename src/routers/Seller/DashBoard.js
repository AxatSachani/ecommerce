const express = require('express')
const auth = require('../../middleware/Auth')
const Order = require('../../models/Order')
const Product = require('../../models/Product')
const router = express.Router()

// dashboard data
router.get('/seller/deshboard/:id', auth, async (req, res) => {
    const msg = 'seller dashboard data'
    var success, orders = 0, balance = 0, alert_message = []
    const seller_id = req.params.id
    console.log('seller dashboard');
    try {
        const products = await Product.find({ seller_id })
        for (let i = 0; i < products.length; i++) {
            var quantity = products[i].quantity
            var livequantity = products[i].livequantity
            var name = products[i].product_details.description
            if (livequantity <= ((quantity * 99) / 100)) {
                alert_message.push(`${name}: ${livequantity} quantity left`)
            }
        }
        const total_product = products.length
        const order = await Order.find({})
        for (let i = 0; i < order.length; i++) {
            for (let j = 0; j < order[i].products.length; j++) {
                if (order[i].products[j].seller_id == seller_id) {
                    orders += 1
                    balance += order[i].products[j].amount
                }
            }
        }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: { total_product, orders, balance, alert_message } })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


// product list
router.get('/seller/product/:id', auth, async (req, res) => {
    const msg = 'peoduct list'
    const seller_id = req.params.id
    console.log('seller product list');
    try {
        const products = await Product.find({ seller_id }).select({ product_details: 1, livequantity: 1, product_price: 1 })
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: products })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, mesage: error.message })
    }
})


// product details 
router.get('/seller/product/details/:id', auth, async (req, res) => {
    const msg = 'product details'
    const product_id = req.params.id
    var success
    console.log('seller product details');
    try {
        const product = await Product.findById(product_id)
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: product })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


//update product
router.put('/seller/product/update/:id', auth, async (req, res) => {
    const msg = 'product update'
    const product_id = req.params.id
    var success
    console.log('product update');
    try {
        const update_field = Object.keys(req.body)
        const allowUpdate = ['product_price', 'quantity', 'size', 'product_details', 'tag', 'features', 'delivery_option']
        const updateValidation = update_field.every((update_field) => allowUpdate.includes(update_field))
        if (!updateValidation) {
            throw new Error('invalid update')
        }

        const product = await Product.findById(product_id)
        if (!product) {
            throw new Error('product not found')
        }

        update_field.forEach((update_field) => {
            product[update_field] = req.body[update_field]
        })

        await product.save()
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: product })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


// delete product
router.delete('/seller/product/delete/:id', auth, async (req, res) => {
    const msg = 'product delete'
    const product_id = req.params.id
    var success
    try {
        const product = await Product.findByIdAndDelete(product_id)
        if (!product) {
            throw new Error('product not found')
        }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


module.exports = router