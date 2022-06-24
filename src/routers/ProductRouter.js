const express = require("express");
const res = require("express/lib/response");
const router = express.Router()
const Product = require('../models/Product')


// add product by seller 
router.post('/add/product', async (req, res) => {
    const msg = 'Product added'
    try {
        const product = await Product(req.body)
        await product.save()
        res.status(201).send({ code: 201, message: msg, data: product })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})

// get all product
router.get('/all-product', async (req, res) => {
    const msg = 'all products'
    try {
        const products = await Product.find()
        const count = await Product.find().countDocuments()
        res.status(200).send({ code: 200, message: msg, totalProduct: count, data: products })
    } catch (error) {
        res.status(404).send({ code: 404, message: error.message })
    }
})

module.exports = router


/*
size:{

}
*/