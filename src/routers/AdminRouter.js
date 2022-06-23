const express = require("express");
const router = express.Router()
const Admin = require('../models/Admin')


// Admin Signup
router.post('/admin/signup', async (req, res) => {
    const msg = 'Admin created'
    try {
        const admin = await Admin(req.body).save()
        res.status(201).send({ code: 201, message: msg, data: admin })
    } catch (error) {
        res.status(400).send({ code: 400, message: error })
    }
})

// Admin Login
router.get('/admin/signin', async (req, res) => {
    const emailId = req.body.emailId
    const password = req.body.password
    const msg = 'Admin signin successfully'
    try {
        const admin = await Admin.findByCredentials(emailId, password)
        res.status(200).send({ code: 200, message: msg, data: admin })
    } catch (error) {
        res.status(404).send({ code: 404, message: error.message })
    }
})

module.exports = router