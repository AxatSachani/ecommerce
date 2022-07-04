const express = require("express");
const cron = require('node-cron');
const fs = require('fs')
const Order = require("../models/Order");
const User = require("../models/User");
const router = express.Router()

router.get('/backup', async (req, res) => {
    try {
        const user = await User.findOne({}).select({ password: 0, tokens: 0 })
        const userData = await User.aggregate([
            {
                $lookup: {
                    from: Order.collection.name,
                    localField: '_id',
                    foreignField: 'user_id',
                    as: `data`,
                }
            },
            {
                $project: {
                    password:0,
                    tokens:0,
                    
                }
            }
        ])

        res.send(userData)
    } catch (error) {
        res.send(error.message)
    }
})



const backup = cron.schedule(' * * * * *', async function () {
    console.log('inside');
    const user = await User.findOne({}).select({ password: 0, tokens: 0 })
    const userOrder = await Order.find({ user_id: user._id })
    console.log(userOrder);
    fs.appendFile(`${user._id}.txt`, userOrder.toString(), (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('backup');
        }
    })
}, {
    scheduled: false
})
backup.stop()

module.exports = router