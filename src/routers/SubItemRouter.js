const express = require("express");
const moment = require('moment')
const SubItems = require("../models/SubItems");
const router = express.Router()

//add new subItem-type
router.post('/add/subitem', async (req, res) => {
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
router.get('/get/subitems-type', async (req, res) => {
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
router.patch('/update/subitem/:item/:type', async (req, res) => {
    const item = req.params.item.toUpperCase()
    const type = req.params.type.toUpperCase()
    const subItem_type = req.body.subItem_type
    const createAt = moment(Date.now()).format('DD/MM/YYYY hh:mm a')
    const msg = 'subItem updated'
    try {
        const subItem = await SubItems.findOneAndUpdate({ subItem_type: type, item_type: item }, { subItem_type, createAt })
        if (!subItem) {
            throw new Error(`No item found with type: '${item}','${type}' `)
        }
        res.status(200).send({ code: 200, message: msg })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})

// delete subitems
router.delete('/delete/:item/:type', async (req, res) => {
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