const express = require("express");
const res = require("express/lib/response");
const auth = require("../middleware/Auth");
const Items = require("../models/Items");
const router = express.Router()
const Product = require('../models/Product');
const SubChild = require("../models/SubChildItem");
const SubItems = require("../models/SubItems");


// add product by seller 
router.post('/add/product', auth, async (req, res) => {
    const msg = 'Product added'
    const subChild_type = req.body.subChild_type
    const subItem_type = req.body.subItem_type
    const item_type = req.body.item_type
    var success
    console.log('pro-add');
    try {
        const subItemtype = await SubChild.findOne({ subChild_type, subItem_type, item_type })
        if (!subItemtype) {
            throw new Error('Invalid types')
        }
        const product = await Product(req.body)
        await product.save()
        success = true
        res.status(201).send({ code: 201, success: success, message: msg, data: product })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})

// get all product
router.get('/products', auth, async (req, res) => {
    const msg = 'all products'
    var success
    console.log('pro-all');
    try {
        const products = await Product.find().select({ _id: 1, product_details: 1, product_price: 1 })
        const count = await Product.find().countDocuments()
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, totalProduct: count, data: products })
    } catch (error) {
        success = false
        res.status(404).send({ code: 404, success: success, message: error.message })
    }
})


// product details
router.get('/product/:id', auth, async (req, res) => {
    const msg = 'product details'
    var alert_message = ''
    const product_id = req.params.id
    var success
    console.log('pro-deteils');
    try {
        const product = await Product.findById(product_id)
        if (!product) {
            throw new Error('product not found')
        }
        const quentity = product.quantity
        if (quentity <= 200 && quentity >= 100) {
            alert_message = `In Stock!`
        }
        if (quentity < 100 && quentity > 30) {
            alert_message = `Hurry up!`
        }
        if (quentity < 30 && quentity > 0) {
            alert_message = `Only ${quentity} left in stock`
        }
        if (quentity == 0) {
            alert_message = `Out of stock !`
        }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: { alert_message, product } })
    } catch (error) {
        success = false
        res.status(404).send({ code: 404, success: success, message: error.message })
    }
})

module.exports = router


/*
size:{

}
*/