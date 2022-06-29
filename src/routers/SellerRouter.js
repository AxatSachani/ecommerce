const express = require("express");
const multer = require('multer');
const Seller = require("../models/Seller");
const Photo = require("../models/Photo");
const router = express.Router()
const SellerRequest = require('../models/SellerRequest')
const ForgetPassword = require('../models/ForgetPass');


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
})

router.post('/request/account', upload.array('document', 12), async (req, res) => {
    const msg = 'new request create for seller account'
    // const document = req.files
    // console.log(document);
    // const first_name = req.body.first_name
    // const last_name = req.body.last_name
    // const emailId = req.body.emailId
    // const contact_no = req.body.contact_no
    // const password = req.body.password
    // const data = { first_name, last_name, emailId, contact_no, password, document }
    // console.log(data);
    try {
        const sellerRequest = await SellerRequest(res.body)
        await sellerRequest.save()
        res.status(201).send({ code: 201, message: msg, data: sellerRequest })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})

// const multer = require('multer');
// const res = require('express/lib/response');


// signin with seller ID
router.get('/seller/signin', async (req, res) => {
    const emailId = req.body.emailId
    const password = req.body.password
    const msg = 'seller signin successfully'
    try {
        const seller = await Seller.findByCredentials(emailId, password)
        res.status(200).send({ code: 200, message: msg, data: seller })
    } catch (error) {
        res.status(404).send({ code: 404, message: error.message })
    }
})

//update seller profile
router.patch('/update/seller/:id', async (req, res) => {
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