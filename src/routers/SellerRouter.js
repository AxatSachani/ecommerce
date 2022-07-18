const express = require("express");
const multer = require('multer');
const Seller = require("../models/Seller");
const Photo = require("../models/Photo");
const router = express.Router()
const SellerRequest = require('../models/SellerRequest')
const ForgetPassword = require('../models/ForgetPass');
const SellerRejected = require("../models/SellerRejected");
const auth = require("../middleware/Auth");


// seller signup (create seller account)
const upload = multer({
    limits: {
        fileSize: 8000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpeg|jpg|pdf)$/)) {
            return cb(new Error('InCorrect file format'))
        }
        cb(undefined, true)
    }
}).single('document')

router.post('/seller/account', async (req, res) => {
    const msg = 'new request create for seller account'
    const emailId = req.body.emailId
    var success
    console.log('seller-req');
    try {
        const seller = await Seller.findOne({ emailId })
        if (seller) {
            throw new Error('already existing')
        }
        const rejectSeller = await SellerRejected.findOne({ emailId })
        if (rejectSeller) {
            throw new Error(`seller alreddy rejected with reason: ${rejectSeller.reject_reason}`)
        }
        const sellerRequest = await SellerRequest(req.body)
        await sellerRequest.save()
        success = true
        res.status(201).send({ code: 201, success: success, message: msg, data: sellerRequest })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})



// signin with seller ID
router.post('/seller/signin', async (req, res) => {
    const emailId = req.body.emailId
    const password = req.body.password
    const msg = 'seller signin successfully'
    var success
    console.log('seller-sigin');
    try {
        const seller = await Seller.findByCredentials(emailId, password)
        const token = await seller.generateAuthToken()
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: seller, token })
    } catch (error) {
        success = false
        res.status(404).send({ code: 404, success: success, message: error.message })
    }
})


// seller signout
router.get('/seller/signout', auth, async (req, res) => {
    const msg = 'seller signout'
    const id = req.body.seller_id
    var success
    try {
        const seller = await Seller.findById(id,)
        if (!seller) {
            throw new Error('Seller not found')
        }
        for (var i = 0; i < seller.tokens.length; i++) {
            const token = seller.tokens[i].token == req.header('Authorization')
            if (token) {
                seller.tokens.splice(i, 1)
                break;
            }
        }
        await seller.save()
        success = true
        res.status(200).send({ code: 200, success: success, message: msg })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


//update seller profile
router.put('/seller/:id', auth, async (req, res) => {
    const id = req.params.id
    const msg = 'data updated'
    const update_field = Object.keys(req.body)
    const allowUpdate = ['first_name', 'last_name', 'emailId', 'contact_no', 'password']
    const updateValidation = update_field.every((update_field) => allowUpdate.includes(update_field))
    if (!updateValidation) {
        throw new Error('check field')
    }
    var success
    console.log('seller-update');
    try {
        const seller = await Seller.findById(id)
        if (!seller) {
            throw new Error(`not found.`)
        }
        update_field.forEach((update_field) => {
            seller[update_field] = req.body[update_field]
        })
        await seller.save()
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: seller })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})





module.exports = router