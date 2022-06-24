const express = require("express");

const Seller = require("../models/Seller");
const router = express.Router()
const SellerRequest = require('../models/SellerRequest')
const ForgetPassword = require('../models/ForgetPass');
const res = require("express/lib/response");


// seller signup (create seller account)
router.post('/request/account', async (req, res) => {
    const msg = 'new request create for seller account'
    try {
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
        update_field.forEach((update_field)=>{
            seller[update_field] = req.body[update_field]
        })
        await seller.save()
        res.status(200).send({code:200,message:msg,data:seller})
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})




// forget password
router.post('/generateOTP', async (req, res) => {
    const emailId = req.body.emailId
    try {
        const seller = await Seller.findOne({ emailId })
        if (!seller) {
            throw new Error('Seller not found')
        }
        const seller_id = seller._id
        const otp = Math.floor(Math.random() * (9989 - 1211 + 1)) + 1211
        const regenerate = await ForgetPassword.findOne({ emailId })
        if (regenerate) {
            const time = Date.now()
            await ForgetPassword.findOneAndUpdate({ emailId }, { otp, time })
        } if (!regenerate) {
            await ForgetPassword({ emailId, seller_id, otp }).save()
        }
        res.send({ message: 'OTP sent' })
    } catch (error) {
        res.send({ message: error.message })
    }
})

router.post('/forget', async (req, res) => {
    const emailId = req.body.emailId
    const otp = req.body.otp
    const password = req.body.password
    try {
        const seller = await Seller.findOne({ emailId })
        if (!seller) {
            throw new Error('Seller not found')
        }
        const details = await ForgetPassword.findOne({ emailId })
        if (!details) {
            throw new Error('Invalid emailid')
        }
        const validOTP = details.otp
        const validTime = details.time + 120000 // 3800 + 120 = 3920
        const currentTime = Date.now()     // 3900 3921 cTime>vTime
        if (otp == validOTP && currentTime < validTime) {
            seller.password = password
            await seller.save()
            await ForgetPassword.findOneAndDelete({ emailId })
        }
        if (otp != validOTP) {
            throw new Error('Invalid OTP')
        }
        if (currentTime > validTime) {
            throw new Error('Time Out')
        }
        res.send({ message: 'Password changed.' })
    } catch (error) {
        res.send({ message: error.message })
    }
})



module.exports = router