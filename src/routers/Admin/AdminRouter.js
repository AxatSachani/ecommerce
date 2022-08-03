const express = require("express");
const crypto = require('crypto')
const res = require("express/lib/response");
const auth = require("../../middleware/Auth");
const router = express.Router()
const Admin = require('../../models/Admin');
const Seller = require("../../models/Seller");
const SellerRejected = require("../../models/SellerRejected");
const SellerRequest = require("../../models/SellerRequest");
const Items = require("../../models/Items");
const Product = require("../../models/Product");
const Order = require("../../models/Order");
const { log } = require("console");
const User = require("../../models/User");


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

        const category = await Items.find({}).countDocuments()
        const products = await Product.find({}).countDocuments()
        const sellerRequest = await SellerRequest.find({}).countDocuments()
        const seller = await Seller.find({}).countDocuments()
        const sellerRejected = await SellerRejected.find({}).countDocuments()
        const order = await Order.find({}).countDocuments()

        const data = { admin, category, products, sellerRequest, seller, sellerRejected, order, token }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: data })
    } catch (error) {
        success = false
        res.status(404).send({ code: 404, success: success, message: error.message })
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
            throw new Error(`Admin not found`)
        }
        
        update_fields.forEach((update_fields) => {
            admin[update_fields] = req.body[update_fields]
        })
        await admin.save()
        succes = true
        res.status(200).send({ code: 201, succes: succes, message: msg })
    } catch (error) {
        succes = false
        res.status(400).send({ code: 400, succes: succes, message: error.message })
    }
})


// user list
router.get('/user', auth, async (req, res) => {
    const msg = 'users list'

    var name, DOB, alterContact_no
    var userData = []

    console.log('user list from admin');
    try {
        const user = await User.find({}).select({})
        for (let i = 0; i < user.length; i++) {
            name = user[i].first_name + ' ' + user[i].last_name
            var emmailId = user[i].emailId
            var contact_no = user[i].contact_no
            var address = user[i].address.city
            DOB = user[i].DOB
            if (!DOB) {
                DOB = ''
            }
            alterContact_no = user[i].alterContact_no
            if (!alterContact_no) {
                alterContact_no = ''
            }
            var join_date = user[i].createAt
            userData.push({ name, emmailId, contact_no, address, DOB, alterContact_no, join_date })
        }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: userData })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})

module.exports = router