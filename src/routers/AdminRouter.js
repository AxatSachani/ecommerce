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
    var success
    console.log('admin-signup');
    try {
        const admin = await Admin(req.body).save()
        const token = await admin.generateAuthToken()
        success = true
        res.status(201).send({ code: 201, success: success, message: msg, data: admin, token })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})

// Admin Login
router.post('/admin/signin', async (req, res) => {
    const emailId = req.body.emailId
    const password = req.body.password
    const msg = 'Admin signin successfully'
    var success
    console.log('admin-signin');
    try {
        const admin = await Admin.findByCredentials(emailId, password)
        const token = await admin.generateAuthToken()
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: admin, token })
    } catch (error) {
        success = false
        res.status(404).send({ code: 404, success: success, message: error.message })
    }
})

// get seller account create request
router.get('/account/request', async (req, res) => {
    const msg = 'account request'
    var success
    console.log('admin-request');
    try {
        const sellerRequest = await SellerRequest.find({}).select({ password: 0 })
        const count = await SellerRequest.find({}).countDocuments()
        // const count1 = await SellerRequest.aggregate([
        //     { $count:"totalRequest" }
        // ])
        // console.log(count1[0]);
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, totalRequest: count, data: sellerRequest })
    } catch (error) {
        success = false
        res.status(404).send({ code: 404, success: success, message: error.message })
    }
})

// get rejected seller account details
router.get('/rejected/seller', auth, async (req, res) => {
    const msg = 'all rejected seller account'
    var success
    console.log('admin-reject');
    try {
        const sellerRejected = await SellerRejected.find({})
        const count = await SellerRejected.find({}).countDocuments()
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, totalRequest: count, data: sellerRejected })
    } catch (error) {
        success = false
        res.status(404).send({ code: 404, success: success, message: error.message })
    }
})

// view seller profile
router.get('/seller/profile/:id', async (req, res) => {
    const msg = 'Seller profile'
    const seller_id = req.params.id
    var success
    console.log('admin-seller-profile');
    try {
        const seller = await Seller.findById(seller_id).select({password:0})
        if (!seller) {
            throw new Error('Seller not found')
        }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: seller })
    } catch (error) {
        success = false
        res.statusCode(400).send({ code: 400, success: success, message: error.message })
    }
})

//approve or reject 
router.post('/request/action/:sellerId', auth, async (req, res) => {
    const _id = req.params.sellerId
    const action = req.body.action
    const rejectMsg = 'reject seller account request\nsent email to seller with rejection reason'
    var success
    console.log('admin-action');
    try {
        const sellerRequest = await SellerRequest.findById(_id)
        if (!sellerRequest) {
            const msg = 'Seller not found!'
            success = false
            res.status(404).send({ code: 404, success: success, message: msg })
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
                success = true
                res.status(200).send({ code: 200, success: success, message: rejectMsg, data: sellerRejected })

            } else {
                const approvMsg = `new seller created. sent email to seller that confirm your seller account and change your password and continue with your seller account. current tempory password is: ${password} `
                const seller = await Seller(sellerDetails)
                await seller.save()
                await SellerRequest.findByIdAndDelete(_id)
                success = true
                res.status(201).send({ code: 201, success: success, message: approvMsg, data: seller })
            }
        }
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})


// update admin data
router.put('/admin/:id', auth, async (req, res) => {
    const msg = 'Admin data updated'
    const id = req.params.id
    var succes
    console.log('admin-update');
    try {
        const update_fields = Object.keys(req.body)
        const allowUpdate = ['first_name', 'last_name', 'emailId', 'contact_no', 'password']
        const updateValidation = update_fields.every((update_fields) => allowUpdate.includes(update_fields))
        if (!updateValidation) {
            throw new Error(`Invalid update`)
        }
        const admin = await Admin.findById(id)
        if (!admin) {
            // throw new Error(`Admin not found`)
            const msg = 'Admin not found'
            succes = false
            res.status(404).send({ code: 404, succes: succes, message: msg })
        } else {
            update_fields.forEach((update_fields) => {
                admin[update_fields] = req.body[update_fields]
            })
            await admin.save()
            succes = true
            res.status(200).send({ code: 201, succes: succes, message: msg })
        }
    } catch (error) {
        succes = false
        res.status(400).send({ code: 400, succes: succes, message: error.message })
    }
})

module.exports = router