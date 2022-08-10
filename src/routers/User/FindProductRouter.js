const express = require('express')
const auth = require('../../middleware/Auth')
const Product = require('../../models/Product')
const router = express.Router()

// find products from params
router.get('/product/:item_type/:subChild_type', auth, async (req, res) => {
    const item_type = req.params.item_type
    const subChild_type = req.params.subChild_type
    const msg = 'all product'
    var success
    console.log('pro-find');
    try {
        const product = await Product.find({ item_type, subChild_type }).select({ _id: 1, product_details: 1, product_price: 1 }) //.$where(item_type, subChild_type)
        if (product.length == 0) {
            throw new Error('Product not found')
        }
        success = true
        res.send({ code: 200, success: success, message: msg, data: product })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})



// find product from tag
router.get('/products/', auth, async (req, res) => {
    var success, product
    var tag = req.query.tag
    var gender = req.query.gender
    var type = req.query.type
    const msg = `all products releted applied filter`
    try {
        product = await Product.find().select({ _id: 1, product_details: 1, product_price: 1 })
        if (tag) {
            product = await Product.find({ tag }).select({ _id: 1, product_details: 1, product_price: 1 })
        }
        if (gender) {
            product = await Product.find({ tag }).where({ item_type: `${gender}` }).select({ _id: 1, product_details: 1, product_price: 1 })
        }
        if (type) {
            product = await Product.find({ tag }).where({ subChild_type: `${type}` }).select({ _id: 1, product_details: 1, product_price: 1 })
        }
        if (product.length == 0) {
            throw new Error('Product not found')
        }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: product })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


module.exports = router