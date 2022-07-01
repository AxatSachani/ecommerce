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
    try {
        const subItemtype = await SubChild.findOne({ subChild_type, subItem_type, item_type })
        console.log(subItemtype);
        if (!subItemtype) {
            throw new Error('Invalid types')
        }
        const product = await Product(req.body)
        await product.save()
        res.status(201).send({ code: 201, message: msg, data: product })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})

// get all product
router.get('/all-product', auth, async (req, res) => {
    const msg = 'all products'
    try {
        const products = await Product.find()
        const count = await Product.find().countDocuments()
        res.status(200).send({ code: 200, message: msg, totalProduct: count, data: products })
    } catch (error) {
        res.status(404).send({ code: 404, message: error.message })
    }
})


// product details
router.get('/product/:id', auth, async (req, res) => {
    const msg = 'product details'
    const product_id = req.params.id
    try {
        const product = await Product.findById( product_id )
        if (!product) {
            throw new Error('product not found')
        }
        res.status(200).send({ code: 200, message: msg, data: product })
    } catch (error) {
        res.status(404).send({ code: 404, message: error.message })
    }
})

module.exports = router


/*
size:{

}
*/