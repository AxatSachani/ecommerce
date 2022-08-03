const express = require("express");
const router = express.Router()
const crypto = require('crypto')
const auth = require("../../middleware/Auth");
const Seller = require("../../models/Seller");
const SellerRejected = require("../../models/SellerRejected");
const SellerRequest = require("../../models/SellerRequest");
const Product = require("../../models/Product");
const Order = require("../../models/Order");

// ----------------------------------------------------------------seller request ----------------------------------------------------------- // 

// get seller account request
router.get('/account/request', auth, async (req, res) => {
    const msg = 'account request'
    var success
    console.log('admin-request');
    var requestData = []
    try {
        const sellerRequest = await SellerRequest.find({}).select({ password: 0 })
        for (let i = 0; i < sellerRequest.length; i++) {
            const _id = sellerRequest[i]._id
            const store_name = sellerRequest[i].store_name
            const address = sellerRequest[i].address
            const contact_no = sellerRequest[i].contact_no
            const emailId = sellerRequest[i].emailId
            const status = 'request'
            const Data = { _id, store_name, address, contact_no, emailId, status }
            requestData.push(Data)
        }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: requestData })
    } catch (error) {
        success = false
        res.status(404).send({ code: 404, success: success, message: error.message })
    }
})

// requested seller profile
router.get('/seller/request/:id', auth, async (req, res) => {
    const msg = 'seller profile'
    const seller_id = req.params.id
    var success
    console.log('req-seller-profile');
    try {
        const sellerProfile = await SellerRequest.findById(seller_id).select({ password: 0 })
        if (!sellerProfile) {
            throw new Error('data not found')
        }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: sellerProfile })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, succes: success, message: error.message })
    }
})

//approve or reject 
router.post('/request/action/:sellerId', auth, async (req, res) => {
    const id = req.params.sellerId
    const action = req.body.action
    const rejectMsg = 'reject seller account request\n sent email to seller with rejection reason'
    var success
    console.log('admin-action');
    try {
        const sellerRequest = await SellerRequest.findById(id)
        if (!sellerRequest) {
            throw new Error('data not found')
        }
        const _id = id
        const first_name = sellerRequest.first_name
        const last_name = sellerRequest.last_name
        const store_name = sellerRequest.store_name
        const address = sellerRequest.address
        const document = sellerRequest.document
        const emailId = sellerRequest.emailId
        const contact_no = sellerRequest.contact_no
        const remark = req.body.remark
        const password = crypto.randomBytes(6).toString('hex')
        if (action !== 'approve') {
            const password = sellerRequest.password
            var sellerDetails = { _id, first_name, last_name, store_name, address, document, emailId, contact_no, password, remark }
            const sellerRejected = await SellerRejected(sellerDetails).save()
            await SellerRequest.findByIdAndDelete(_id)
            success = true
            res.status(200).send({ code: 200, success: success, message: rejectMsg })
        } else {
            var sellerDetails = { _id, first_name, last_name, store_name, address, document, emailId, contact_no, password, remark }
            const approvMsg = `new seller created. sent email to seller that confirm your seller account and change your password and continue with your seller account. current tempory password is: ${password} `
            const seller = await Seller(sellerDetails)
            await seller.save()
            await SellerRequest.findByIdAndDelete(_id)
            success = true
            res.status(201).send({ code: 201, success: success, message: approvMsg, data: seller })
        }
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})


// ---------------------------------------------------------------- Sellers ----------------------------------------------------------- // 

// all seller 
router.get('/seller', auth, async (req, res) => {
    const msg = 'seller list'
    var success
    var requestData = []
    console.log('seller-list');
    try {
        const seller = await Seller.find({})
        for (let i = 0; i < seller.length; i++) {
            const _id = seller[i]._id
            const store_name = seller[i].store_name
            const address = seller[i].address
            const contact_no = seller[i].contact_no
            const emailId = seller[i].emailId
            const status = 'active'
            const Data = { _id, store_name, address, contact_no, emailId, status }
            requestData.push(Data)
        }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: requestData })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


// view seller profile
router.get('/seller/profile/', auth, async (req, res) => {
    const msg = 'Seller profile'
    const seller_id = req.query.id
    const profile = req.query.profile
    var orders = 0, balance = 0
    var success
    console.log('admin-seller-profile');
    try {
        var seller = await Seller.findById(seller_id).select({ address: 1, store_name: 1 })
        if (!seller) {
            throw new Error('Seller not found')
        }

        if (profile) {
            seller = await Seller.findById(seller_id)
            success = true
            res.status(200).send({ code: 200, success: success, message: msg, data: seller })
        }
        else {
            const products = await Product.find({ seller_id }).select({ product_details: 1, item_type: 1, subChild_type: 1, product_price: 1 })
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
            res.status(200).send({ code: 200, success: success, message: msg, data: { seller, total_product, orders, balance, products } })
        }
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


// ----------------------------------------------------------------seller rejected ----------------------------------------------------------- // 

// get rejected seller account details
router.get('/seller/rejected/', auth, async (req, res) => {
    const msg = 'all rejected seller account'
    var success
    var rejectData = []
    console.log('admin-reject');
    try {
        const sellerRejected = await SellerRejected.find({}).select({ password: 0 })
        for (let i = 0; i < sellerRejected.length; i++) {
            const _id = sellerRejected[i]._id
            const store_name = sellerRejected[i].store_name
            const address = sellerRejected[i].address
            const contact_no = sellerRejected[i].contact_no
            const emailId = sellerRejected[i].emailId
            const status = 'rejected'
            const Data = { _id, store_name, address, contact_no, emailId, status }
            rejectData.push(Data)
        }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: rejectData })
    } catch (error) {
        success = false
        res.status(404).send({ code: 404, success: success, message: error.message })
    }
})

// get rejected seller profile
router.get('/seller/reject/:id', auth, async (req, res) => {
    const msg = 'seller rejected profile'
    const seller_id = req.params.id
    console.log('rejected profile');
    try {
        const sellerProfile = await SellerRejected.findById(seller_id).select({ password: 0 })
        if (!sellerProfile) {
            throw new Error('data not found')
        }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: sellerProfile })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


// rejected seller action
router.post('/seller/reject/action/:id', auth, async (req, res) => {
    const msg = 'seller action'
    const seller_id = req.params.id
    const action = req.body.action
    try {
        if (action == 'active') {
            const sellerReject = await SellerRejected.findById(seller_id)
            if (!sellerReject) {
                throw new Error('data not found')
            }
            const _id = seller_id
            const first_name = sellerReject.first_name
            const last_name = sellerReject.last_name
            const store_name = sellerReject.store_name
            const address = sellerReject.address
            const document = sellerReject.document
            const emailId = sellerReject.emailId
            const contact_no = sellerReject.contact_no
            const remark = req.body.remark
            const password = crypto.randomBytes(6).toString('hex')

            var sellerDetails = { _id, first_name, last_name, store_name, address, document, emailId, contact_no, password, remark }
            var approvMsg = `active rejected seller account. sent email to seller that inform your seller account and change your password and continue with your seller account. current tempory password is: ${password} `
            const seller = await Seller(sellerDetails)
            await seller.save()
            await SellerRejected.findByIdAndDelete(seller_id)
        }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: approvMsg })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})



module.exports = router