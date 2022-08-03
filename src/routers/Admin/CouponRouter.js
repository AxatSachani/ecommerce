const express = require('express')
const auth = require('../../middleware/Auth')
const Coupon = require('../../models/Coupon')
const router = express.Router()
const cron = require('node-cron');
const moment = require('moment')

//add new Coupon
router.post('/coupon/add', auth, async (req, res) => {
    const msg = 'coupon generate'
    var success
    const coupon_code = req.body.coupon_code.toUpperCase()
    const coupon_type = req.body.coupon_type
    const discount = req.body.discount
    const condition = req.body.condition
    const description = req.body.description
    var EndDate = req.body.EndDate
    console.log('b', EndDate);
    EndDate = moment(EndDate).format('DD/MM/YYYY')
    console.log('a', EndDate);

    var specialChr = false
    const data = { coupon_code, coupon_type, discount, condition, description, EndDate }
    console.log('add-coupon');
    try {
        const couponCheck = await Coupon.findOne({ coupon_code })
        if (couponCheck) {
            console.log('match');
            throw new Error('coupon alredy existing')
        }
        for (let i = 0; i < discount.length; i++) {
            if (discount[i] == '%') {
                specialChr = true
            }
        }
        if (coupon_type == '% Basis') {
            if (!specialChr) {
                throw new Error('discount must be in %')
            }
            const checkDiscount = discount.split('%')
            if (Number(checkDiscount[0]) > 100) {
                throw new Error('discount should be in 100%')
            }
            const coupon = await Coupon(data)
            await coupon.save()
        }
        const coupon = await Coupon(data)
        await coupon.save()
        success = true
        res.status(200).send({ code: 200, success: success, message: msg })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


// get dscount coupon code
router.get('/coupon', auth, async (req, res) => {
    const msg = 'all coupon'
    var success
    console.log('get coupun code');
    try {
        const coupon = await Coupon.find({}).select({ _id: 0, coupon_code: 1, description: 1 })
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: coupon })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


// coupon data
router.get('/coupon/details', auth, async (req, res) => {
    const msg = 'coupon details'
    var success
    console.log('coupon details');
    try {
        const coupon = await Coupon.find({}).select({ condition: 0, description: 0 })
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: coupon })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


// delete coupon 
router.delete('/coupon/delete/:id', auth, async (req, res) => {
    const msg = 'coupon delete'
    var success
    const coupon_id = req.params.id
    console.log('coupon delete');
    try {
        const coupon = await Coupon.findByIdAndDelete(coupon_id)
        if (!coupon) {
            throw new Error('data not found')
        }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})

// delete expired coupon code
// const couponDelte = cron.schedule('17 18 * * *', async function () {
//     var EndDate = moment(Date.now()).format('DD/MM/YYYY')
//     const coupon = await Coupon.find({ EndDate })
//     for (let i = 0; i < coupon.length; i++) {
//         const c = await Coupon.findOneAndDelete({ EndDate })
//         console.log(c);
//     }
// })


module.exports = router