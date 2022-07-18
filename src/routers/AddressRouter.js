const express = require("express");
const auth = require("../middleware/Auth");
const router = express.Router()
const { BillingAddress, ShippingAddress } = require('../models/Address');
const User = require("../models/User");



// update address(bill address)
router.put('/user/billing-address/:id', auth, async (req, res) => {
    const user_id = req.params.user_id
    const address = req.body.address
    const msg = 'Address updated'
    var success
    console.log('biil-address');
    try {
        const user = await User.findById(user_id)
        if (!user) {
            throw new Error('User not found')
        }
        user.address = address
        await user.save()

        const userBillAddress = await BillingAddress.findOne({user_id})
        userBillAddress.address = address
        await userBillAddress.save()

        const userShippAddress = await ShippingAddress.findOne({user_id})
        userShippAddress.address = address
        await userShippAddress.save()
        success = true
        res.status(200).send({ code: 200, success: success, message: msg })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


// update address (shipp address)
router.put('/user/shipping-address/:id', auth, async (req, res) => {
    const user_id = req.params.user_id
    const msg = 'Address updated'
    const address = req.body.address
    var success
    console.log('shipp-address');
    try {
        const user = await ShippingAddress.findOne({user_id})
        if (!user) {
            throw new Error('User not found')
        }
        user.address = address
        await user.save()
        success = true
        res.status(200).send({ code: 200, success: success, message: msg })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})



module.exports = router