const express = require("express");
const moment = require('moment')
const SubItems = require("../models/SubItems");
const router = express.Router()
const auth = require('../middleware/Auth')

//add new subItem-type
router.post('/add/subitem', auth,async (req, res) => {
    const subItem_type = req.body.subItem_type.toUpperCase()
    const item_type = req.body.item_type.toUpperCase()
    const msg = 'SubItem created'
    try {
        const already_type = await SubItems.findOne({ subItem_type, item_type })
        // const already_type = await SubItems.findOne({ subItem_type: { $regex: subItem_type, $options: 'i' }, item_type: { $regex: item_type, $options: 'i' } })
        if (already_type) {
            throw new Error(`Sub-item '${subItem_type}' already existing`)
        }
        const subItem = await SubItems(req.body)
        await subItem.save()
        res.status(201).send({ code: 201, message: msg, data: subItem })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})

// get all subitems
router.get('/get/subitems-type',auth, async (req, res) => {
    const msg = 'all subItems data'
    try {
        const subItems = await SubItems.find()
        const count = await SubItems.find().countDocuments()
        res.status(200).send({ code: 200, message: msg, totalItems: count, data: subItems })
    } catch (error) {
        res.status(404).send({ code: 404, message: error.message })
    }
})

// update subitems
router.post('/update/subitem/',auth, async (req, res) => {
    const item_type = req.body.item_type.toUpperCase()
    const oldsubItem_type = req.body.oldsubItem_type.toUpperCase()
    const newsubItem_type = req.body.newsubItem_type
    const updateAt = moment(Date.now()).format('DD/MM/YYYY hh:mm a')
    const msg = 'subItem updated'
    try {
        const subItem = await SubItems.findOne({ subItem_type: oldsubItem_type, item_type: item_type })
        if(!subItem){
            throw new Error(`No item found with type: '${item_type}','${oldsubItem_type}' `)
        }
        subItem.subItem_type =newsubItem_type
        subItem.updateAt = updateAt
        await subItem.save()
        res.status(200).send({ code: 200, message: msg })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})

// delete subitems
router.delete('/delete/subitem/:item/:type', auth,async (req, res) => {
    const item_type = req.params.item.toUpperCase()
    const subItem_type = req.params.type.toUpperCase()
    const msg = 'subItem deleted'
    try {
        const subItem = await SubItems.findOneAndDelete({ subItem_type, item_type })
        if (!subItem) {
            throw new Error(`No item found with type: '${item_type}','${subItem_type}' `)
        }
        res.status(200).send({ code: 200, message: msg, data: subItem })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})

module.exports = router