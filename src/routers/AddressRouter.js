const express = require("express");
const auth = require("../middleware/Auth");
const router = express.Router()
const { BillingAddress, ShippingAddress } = require('../models/Address');
const User = require("../models/User");

// update address
router.patch('/update/bill-address', auth,async (req, res) => {
    const user_id = req.body.user_id
    const address = req.body.address
    const msg = 'Address updated'
    try {
        const user = await User.findByIdAndUpdate(user_id, {address})
        const userBillAddress = await BillingAddress.findOne({ user_id })
        userBillAddress.address = address
        await userBillAddress.save()

        const userShippAddress = await ShippingAddress.findOne({ user_id })
        userShippAddress.address = address
        await userShippAddress.save()
        res.status(200).send({ code: 200, message: msg })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})



router.patch('/update/shipp-address',auth, async (req, res) => {
    const user_id = req.body.user_id
    const msg = 'Address updated'
    try {
        const user = await ShippingAddress.findOne({ user_id })
        user.address = req.body.address
        await user.save()
        res.status(200).send({ code: 200, message: msg, data: user })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})



module.exports = router