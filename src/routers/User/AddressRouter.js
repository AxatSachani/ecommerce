const express = require("express");
const auth = require("../../middleware/Auth");
const router = express.Router()
const Address = require('../../models/Address');
const User = require("../../models/User");

// update address
router.post('/address/:id', auth, async (req, res) => {
    const user_id = req.params.id
    const user_address = req.body.address
    const msg = 'address updated'
    var success
    console.log('address');
    try {
        const userSData = await User.findById(user_id)
        if (!userSData) {
            throw new Error('User not found')
        }
        userSData.address = user_address
        await userSData.save()


        const addressData = await Address.findOne({ user_id })
        addressData.address = user_address
        await addressData.save()
        success = true
        res.status(200).send({ code: 200, success: success, message: msg })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


// user address
router.get('/user/address/:id',auth, async (req, res) => {
    var success
    const user_id = req.params.id
    const msg = 'User address'
    console.log('get adderess');
    try {
        // const address = await client.get(`${user_id}address`)
        // console.log(address.address);
        var userAddress = await User.findById(user_id).select({ address: 1 })
        if (!userAddress.address.city) {
            throw new Error('Add Address')
        }

        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: userAddress.address })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


module.exports = router