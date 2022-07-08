const express = require("express");
const crypto = require('crypto')
const res = require("express/lib/response");
const auth = require("../middleware/Auth");
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
        res.status(201).send({ code: 201, message: msg, data: admin, token })
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
        res.status(200).send({ code: 200, message: msg, data: admin, token })
    } catch (error) {
        res.status(404).send({ code: 404, message: error.message })
    }
})

// get seller account create request
router.get('/account/request', async (req, res) => {
    const msg = 'account request'
    try {
        const sellerRequest = await SellerRequest.find({}).select({ password: 0 })
        const count = await SellerRequest.find({}).countDocuments()
        res.status(200).send({ code: 200, message: msg, totalRequest: count, data: sellerRequest })
    } catch (error) {
        res.status(404).send({ code: 404, message: error.message })
    }
})

// get rejected seller account details
router.get('/rejected/seller', auth, async (req, res) => {
    const msg = 'all rejected seller account'
    try {
        const sellerRejected = await SellerRejected.find({})
        const count = await SellerRejected.find({}).countDocuments()
        res.status(200).send({ code: 200, message: msg, totalRequest: count, data: sellerRejected })
    } catch (error) {
        res.status(404).send({ code: 404, message: error.message })
    }
})

//approve or reject 
router.post('/request/action/:sellerId', auth, async (req, res) => {
    const _id = req.params.sellerId
    const action = req.body.action
    const rejectMsg = 'reject seller account request\nsent email to seller with rejection reason'
    try {
        const sellerRequest = await SellerRequest.findById(_id)
        if (!sellerRequest) {
            const msg = 'Seller not found!'
            res.status(404).send({ code: 404, message: msg })
        } else {
            const first_name = sellerRequest.first_name
            const last_name = sellerRequest.last_name
            const emailId = sellerRequest.emailId
            const contact_no = sellerRequest.contact_no
            const password = crypto.randomBytes(6).toString('hex')

            var sellerDetails = { _id, first_name, last_name, emailId, contact_no, password }
            if (action !== 'approved') {
                const reject_reason = req.body.reject_reason
                var sellerDetails = { _id, first_name, last_name, emailId, contact_no, password, reject_reason }
                const sellerRejected = await SellerRejected(sellerDetails).save()
                await SellerRequest.findByIdAndDelete(_id)
                res.status(200).send({ code: 200, message: rejectMsg, data: sellerRejected })

            } else {
                const approvMsg = `new seller created. sent email to seller that confirm your seller account and change your password and continue with your seller account. current tempory password is: ${password} `

                const seller = await Seller(sellerDetails)
                await seller.save()
                await SellerRequest.findByIdAndDelete(_id)
                res.status(201).send({ code: 201, message: approvMsg, data: seller })
            }
        }
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})


// update admin data
router.post('/update/admin/:id', auth, async (req, res) => {

})

module.exports = router