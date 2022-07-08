const express = require('express')
const auth = require('../middleware/Auth')
const Product = require('../models/Product')
const router = express.Router()

// find products from params
router.get('/product/:item_type/:subChild_type', auth, async (req, res) => {
    const item_type = req.params.item_type
    const subChild_type = req.params.subChild_type
    const msg = 'all product'

    // console.log(typeof (item_type, subChild_type));
    try {
        const product = await Product.find({item_type, subChild_type}).select({_id:1,product_details:1,product_price:1}) //.$where(item_type, subChild_type)
        if(product.length==0){
            throw new Error('Product not found')
        }
        res.send({ code: 200, message: msg, data: product })
    } catch (error) {
        res.status(404).send({ code: 404, message: error.message })
    }
})


module.exports = router