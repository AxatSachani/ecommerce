const express = require("express");
const router = express.Router()
const mongoose = require('mongoose')
const { i } = require('../models/demo')
const { CourierClient } = require("@trycourier/courier");


router.post('/post', async (req, res) => {
    var group = req.body.group

    try {
        const n = i(`${group}`)
        res.send('n')
    } catch (error) {
        res.send({ error: error.message })
    }
})

router.post('/post/data', async (req, res) => {
    var group = req.body.group
    const e = i(`${group}`)
    try {
        const i = await e(req.body).save()
        res.send(i)
    } catch (error) {
        res.send(error.message)
    }
})

router.post('/mail', async (req, res) => {
    const courier = CourierClient({ authorizationToken: "pk_prod_CF62R0EEGY43FZG81AE995C4EDH7" });

    const { requestId } = courier.send({
        message: {
            to: {
                email: "axatsachani2110@gmail.com",
            },
            template: "EVCR08MEWQ4F4CM7TFNXEV1YGAAY",
            data: {
                message: "Akshat",
                password:'this is message'
            },
        },
    });
    res.send('done')
})
// Install with: npm install @trycourier/courier




module.exports = router
