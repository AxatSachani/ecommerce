const express = require('express')
const { auth } = require('firebase-admin')
const Items = require('../../models/Items')
const Order = require('../../models/Order')
const Product = require('../../models/Product')
const Seller = require('../../models/Seller')
const SellerRejected = require('../../models/SellerRejected')
const SellerRequest = require('../../models/SellerRequest')
const router = express.Router()

// Dashboard data
router.get('/dashboard',auth,async (req, res) => {
    const msg = 'dashboard data'
    try {

        const category = await Items.find({}).countDocuments()

        const products = await Product.find({}).countDocuments()

        const sellerRequest = await SellerRequest.find({}).countDocuments()

        const seller = await Seller.find({}).countDocuments()

        const sellerRejected = await SellerRejected.find({}).countDocuments()

        const order = await Order.find({}).countDocuments()

        const data = { category, products, sellerRequest, seller, sellerRejected, order };

        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})




module.exports = router