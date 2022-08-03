const express = require("express");
const router = express.Router()
const User = require('../../models/User')
const Address = require('../../models/Address');
const auth = require("../../middleware/Auth");
const moment = require('moment')
// user Signup
router.post('/user/signup', async (req, res) => {
    const msg = 'User created'
    console.log(`user/signup`);
    var success
    try {
        const user = await User(req.body)
        console.log(req.body.address);
        const token = await user.generateAuthToken()
        const addressDetails = { user_id: user._id, address: req.body.address }
        await user.save()
        console.log(addressDetails);
        await Address(addressDetails).save()
        success = true
        res.status(200).send({ code: 201, success: success, message: msg, data: user, token })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})

//user signin
router.post('/user/signin', async (req, res) => {
    const msg = 'user signin'
    console.log(`user/signin`);
    var success
    try {
        console.log(req.body.emailId);
        console.log(req.body.password);
        const user = await User.findByCredentials(req.body.emailId, req.body.password)
        const token = await user.generateAuthToken()

        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: user, token })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})



// update user details
router.put('/user/:id', auth, async (req, res) => {
    const msg = 'User updated'
    const id = req.params.id
    var success
    console.log('user-update');
    try {
        const update_fields = Object.keys(req.body)
        const allowUpdate = ['first_name', 'last_name', 'emailId', 'contact_no','DOB', 'alterContact_no','gender','address']
        const updateValidation = update_fields.every((update_fields) => allowUpdate.includes(update_fields))
        if (!updateValidation) {
            throw new Error('Invalid update')
        }
        const user = await User.findById(id)
        if (!user) {
            throw new Error('User not found')
        }
        update_fields.forEach((update_fields) => {
            user[update_fields] = req.body[update_fields]
        })
        await user.save()
        success = true
        res.status(200).send({ code: 200,success: success, message: msg, data: user })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400,success:success, message: error.message })
    }
})

// user signout
router.get('/user/signout', auth, async (req, res) => {
    const msg = 'user signout'
    const id = req.body.user_id
    var success 
    console.log('user-out');
    try {
        const user = await User.findById(id,)
        if (!user) {
            throw new Error('User not found')
        }
        for (var i = 0; i < user.tokens.length; i++) {
            const token = user.tokens[i].token == req.header('Authorization')
            if (token) {
                user.tokens.splice(i, 1)
                break;
            }
        }
        await user.save()
        success = true
        res.status(200).send({ code: 200,success:success, message: msg })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400,success:success, message: error.message })
    }
})


module.exports = router