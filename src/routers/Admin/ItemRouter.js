const express = require('express');
const Items = require('../../models/Items');
const router = express.Router()
const moment = require('moment')
const auth = require('../../middleware/Auth')
const { toFormat } = require('../../module/module')


// const f = toFormat("hYY & i'm thIS", { CapitalizedCase: true })

// console.log(f);

//Add new Item type
router.post('/item/add', auth, async (req, res) => {
    const msg = 'Item created'
    var success
    const type = req.body.item_type
    const item_type = toFormat(type)
    console.log('item-add');
    const slug = req.body.slug
    const addedBy = req.body.addedBy
    const itemData = { item_type, slug, addedBy }
    try {
        const already_type = await Items.findOne({ item_type })
        if (already_type) {
            throw new Error(`item type: '${item_type}' already existing`)
        }
        const item = await Items(itemData)
        await item.save()
        success = true
        res.status(201).send({ code: 201, success: success, message: msg, data: item })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


// get all items-types
router.get('/item', auth, async (req, res) => {
    const msg = 'All itmes data'
    var success
    console.log('item-get');
    var item = []
    try {
        const items = await Items.find()
        for (var i = 0; i < items.length; i++) {
            item.push(items[i].item_type)
        }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: item })
    } catch (error) {
        success = false
        res.status(404).send({ code: 404, success: success, message: error.message })
    }
})


// get all items details
router.get('/item/allitems', auth, async (req, res) => {
    var success
    const msg = 'items details'
    console.log('item-details');
    try {
        const items = await Items.find()
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: items })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


// update in items-types
router.put('/item/update', auth, async (req, res) => {
    const item_id = req.body.item_id
    const type = req.body.newitem_type
    const item_type = toFormat(type)
    const updateAt = moment(Date.now()).format('DD/MM/YYYY hh:mm a')
    const msg = 'item-type updated'
    var success
    console.log('item-update');
    try {
        const item = await Items.findByIdAndUpdate(item_id, { item_type, updateAt })
        if (!item) {
            throw new Error(`item not found`)
        }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


//delete items
router.delete('/item/delete/:item_id', auth, async (req, res) => {
    const item_id = req.params.item_id
    const msg = ' Items deleted'
    var success
    console.log('item-del');
    try {
        const item = await Items.findByIdAndDelete(item_id)
        if (!item) {
            throw new Error(`item not found`)
        }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: item })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})

module.exports = router