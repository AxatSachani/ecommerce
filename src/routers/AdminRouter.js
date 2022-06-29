const express = require("express");
const res = require("express/lib/response");
const router = express.Router()
const Admin = require('../models/Admin');
const Seller = require("../models/Seller");
const SellerRejected = require("../models/SellerRejected");
const SellerRequest = require("../models/SellerRequest");


// Admin Signup
router.post('/admin/signup', async (req, res) => {
    const msg = 'Admin created'
    try {
        const admin = await Admin(req.body).save()
        const token = await admin.generateAuthToken()
        res.status(201).send({ code: 201, message: msg, data: admin,token })
    } catch (error) {
        res.status(400).send({ code: 400, message: error })
    }
})

// Admin Login
router.get('/admin/signin', async (req, res) => {
    const emailId = req.body.emailId
    const password = req.body.password
    const msg = 'Admin signin successfully'
    try {
        const admin = await Admin.findByCredentials(emailId, password)
        const token = await admin.generateAuthToken()
        res.status(200).send({ code: 200, message: msg, data: admin,token })
    } catch (error) {
        res.status(404).send({ code: 404, message: error.message })
    }
})

// get seller account create request
router.get('/get/account/request', async (req, res) => {
    const msg = 'all request for new seller account'
    try {
        const sellerRequest = await SellerRequest.find({})
        const count = await SellerRequest.find({}).countDocuments()
        res.status(200).send({ code: 200, message: msg, totalRequest: count, data: sellerRequest })
    } catch (error) {
        res.status(404).send({ code: 404, message: error.message })
    }
})

//approve or reject 
router.post('/request/action/:sellerId', async (req, res) => {
    const _id = req.params.sellerId
    const action = req.body.action
    const approvMsg = 'new seller created. sent email to seller that confirm your seller account and change your password and continue with your seller account '
    const rejectMsg = 'reject seller account request\nsent email to seller with rejection reason'
    try {
        const sellerRequest = await SellerRequest.findById(_id)

        const first_name = sellerRequest.first_name
        const last_name = sellerRequest.last_name
        const emailId = sellerRequest.emailId
        const contact_no = sellerRequest.contact_no
        const password = sellerRequest.password
        const sellerDetails = { _id, first_name, last_name, emailId, contact_no, password }
        if (action !== 'approved') {
            const reject_reason = req.body.reject_reason
            const sellerRejected = await SellerRejected(sellerDetails, reject_reason).save()
            await SellerRequest.findByIdAndDelete(_id)
            res.status(200).send({ code: 200, message: rejectMsg, data: sellerRejected })

        } else {
            const seller = await Seller(sellerDetails)
            const token = await seller.generateAuthToken()
            await seller.save()
            await SellerRequest.findByIdAndDelete(_id)
            res.status(201).send({ code: 201, message: approvMsg, data: seller,token })
        }
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})

module.exports = router