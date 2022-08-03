const express = require("express");

const Seller = require("../../models/Seller");
const User = require("../../models/User");
const router = express.Router()
const ForgetPassword = require('../../models/ForgetPass');
const auth = require("../../middleware/Auth");


// forget seller password
router.post('/seller/generateOTP', async (req, res) => {
    const emailId = req.body.emailId
    var success
    console.log('otp-seller');
    try {
        const seller = await Seller.findOne({ emailId })
        if (!seller) {
            throw new Error('Seller not found')
        }
        const id = seller._id
        const otp = Math.floor(Math.random() * (9989 - 1211 + 1)) + 1211 //0.212154 * 8779
        const regenerate = await ForgetPassword.findOne({ emailId })
        if (regenerate) {
            const time = Date.now()
            await ForgetPassword.findOneAndUpdate({ emailId }, { otp, time })
        } if (!regenerate) {
            await ForgetPassword({ emailId, id, otp }).save()
        }
        setTimeout(async () => {
            await ForgetPassword.findOneAndDelete({ emailId })
        }, 120000);
        success = true
        res.send({ success: success, message: 'OTP sent' })
    } catch (error) {
        success = false
        res.send({ success: success, message: error.message })
    }
})

router.post('/seller/forget/password', async (req, res) => {
    const emailId = req.body.emailId
    const otp = req.body.otp
    const password = req.body.password
    var success
    console.log('pass-seller');
    try {
        const seller = await Seller.findOne({ emailId })
        if (!seller) {
            throw new Error('Seller not found')
        }
        const details = await ForgetPassword.findOne({ emailId })
        if (!details) {
            throw new Error('Time Out')
        }
        const validOTP = details.otp
        // const validTime = details.time + 120000 // 3800 + 120 = 3920
        // const currentTime = Date.now()     // 3900 3921 cTime>vTime
        if (otp == validOTP) {                                                 //&& currentTime < validTime
            seller.password = password
            await seller.save()
            await ForgetPassword.findOneAndDelete({ emailId })
        }
        if (otp != validOTP) {
            throw new Error('Invalid OTP')
        }
        success = true
        res.send({ success: success, message: 'Password changed.' })
    } catch (error) {
        success = false
        res.send({ success: success, message: error.message })
    }
})



// forget user password
router.post('/user/generateOTP', async (req, res) => {
    const emailId = req.body.emailId
    var id
    var success
    console.log('otp-user');
    try {
        const user = await User.findOne({ emailId })
        if (!user) {
            throw new Error('User not found')
        }
        id = user._id
        const otp = Math.floor(Math.random() * (9989 - 1211 + 1)) + 1211
        const regenerate = await ForgetPassword.findOne({ emailId })
        if (regenerate) {
            const time = Date.now()
            await ForgetPassword.findOneAndUpdate({ emailId }, { otp, time })
        } if (!regenerate) {
            await ForgetPassword({ emailId, id, otp }).save()
        }
        setTimeout(async () => {
            await ForgetPassword.findOneAndDelete({ emailId })
        }, 120000);
        success = true
        res.send({ success: success, message: 'OTP sent' })
    } catch (error) {
        success = false
        res.send({ success: success, message: error.message })
    }
})

router.post('/user/forget/password', async (req, res) => {
    const emailId = req.body.emailId
    const otp = req.body.otp
    const password = req.body.password
    var success
    console.log('pass-user');
    try {
        const user = await User.findOne({ emailId })
        if (!user) {
            throw new Error('User not found')
        }
        const details = await ForgetPassword.findOne({ emailId })
        if (!details) {
            throw new Error('Time Out')
        }
        const validOTP = details.otp
        // const validTime = details.time + 120000 // 3800 + 120 = 3920
        // const currentTime = Date.now()     // 3900 3921 cTime>vTime
        if (otp == validOTP) {                                                 //&& currentTime < validTime
            user.password = password
            await user.save()
            await ForgetPassword.findOneAndDelete({ emailId })
        }
        if (otp != validOTP) {
            throw new Error('Invalid OTP')
        }
        success = true
        res.send({ success: success, message: 'Password changed.' })
    } catch (error) {
        success = false
        res.send({ success: success, message: error.message })
    }
})

module.exports = router