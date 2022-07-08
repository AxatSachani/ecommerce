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
    // const document = req.file.document
    // console.log(document);
    // const first_name = req.body.first_name
    // const last_name = req.body.last_name
    const emailId = req.body.emailId
    // const contact_no = req.body.contact_no
    // const password = req.body.password
    // const data = { first_name, last_name, emailId, contact_no, password, document }
    // console.log(data);
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
        res.status(201).send({ code: 201, message: msg, data: sellerRequest })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})



// signin with seller ID
router.get('/seller/signin', async (req, res) => {
    const emailId = req.body.emailId
    const password = req.body.password
    const msg = 'seller signin successfully'
    try {
        const seller = await Seller.findByCredentials(emailId, password)
        const token = await seller.generateAuthToken()
        res.status(200).send({ code: 200, message: msg, data: seller, token })
    } catch (error) {
        res.status(404).send({ code: 404, message: error.message })
    }
})


// seller signout
router.get('/seller/signout', auth, async (req, res) => {
    const msg = 'seller signout'
    const id = req.body.seller_id
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
        res.status(200).send({ code: 200, message: msg })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})


//update seller profile
router.patch('/seller/:id', auth, async (req, res) => {
    const id = req.params.id
    const msg = 'data updated'
    const update_field = Object.keys(req.body)
    const allowUpdate = ['first_name', 'last_name', 'emailId', 'contact_no', 'password']
    const updateValidation = update_field.every((update_field) => allowUpdate.includes(update_field))
    if (!updateValidation) {
        throw new Error('check field')
    }
    try {
        const seller = await Seller.findById(id)
        if (!seller) {
            throw new Error(`not found.`)
        }
        update_field.forEach((update_field) => {
            seller[update_field] = req.body[update_field]
        })
        await seller.save()
        res.status(200).send({ code: 200, message: msg, data: seller })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})





module.exports = router