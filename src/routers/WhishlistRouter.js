const express = require("express");
const Whishlist = require("../models/Whishlist");
const Product = require("../models/Product");
const User = require("../models/User");
const router = express.Router()

// add to whishlist
router.post('/add/whishlist', async (req, res) => {
    const user_id = req.body.user_id
    const product_id = req.body.product_id
    const msg = 'Whishilist added'
    try {
        productDetails = await Product.findById(product_id)
        seller_id = productDetails.seller_id
        product_name = productDetails.product_details.name
        product_price = productDetails.product_price
        const whishListData = { user_id, products: { product_id, seller_id, product_name, product_price } }
        const whishlist = await Whishlist(whishListData)
        await whishlist.save()
        res.status(201).send({ code: 201, message: msg, data: whishlist })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})


// delete whishlist
router.delete('/delete/whishlist', async (req, res) => {
    const msg = 'Whishlist deleted'
    const whishlist_id = req.body.whishlist_id
    try {
        const whishlist = await Whishlist.findByIdAndDelete(whishlist_id)
        if (!whishlist) {
            throw new Error('Not Found')
        }
        res.status(200).send({ code: 200, message: msg })
    } catch (error) {
        res.status(404).send({ code: 404, message: error.message })
    }
})

// get user-whishlist
router.get('/get/user-whishlist', async (req, res) => {
    const msg = 'User Whishlist'
    try {
        const whishlist = await User.aggregate([
            {
                $project: {
                    _id: 1          
                }
            },
            {
                $lookup: {
                    from: Whishlist.collection.name,
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'User Whishlist'
                }
            }
        ])
        res.status(200).send({ code: 200, message: msg, data: whishlist })
    } catch (error) {
        res.status(404).send({ code: 404, message: error.message })
    }
})

module.exports = router