const express = require('express');
const Items = require('../models/Items');
const router = express.Router()
const moment = require('moment')
const auth = require('../middleware/Auth')


//Add new Item type
router.post('/add/item', auth, async (req, res) => {
    const msg = 'Item created'
    try {
        const item_type = req.body.item_type.toUpperCase()
        const already_type = await Items.findOne({ item_type })
        if (already_type) {
            throw new Error(`item type: '${item_type}' already existing`)
        }
        const item = await Items(req.body)
        await item.save()
        res.status(201).send({ code: 201, message: msg, data: item })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})


// get all items-types
router.get('/items', auth, async (req, res) => {
    const msg = 'All itmes data'
    try {
        const items = await Items.find()
        const count = await Items.find().countDocuments()
        res.status(200).send({ code: 200, message: msg, totalItems: count, data: items })
    } catch (error) {
        res.status(404).send({ code: 404, message: error.message })
    }
})


// update in items-types
router.patch('/item', auth, async (req, res) => {
    const olditem_type = req.body.olditem_type.toUpperCase()
    const item_type = req.body.newitem_type
    const createAt = moment(Date.now()).format('DD/MM/YYYY hh:mm a')
    const msg = 'item-type updated'
    try {
        const item = await Items.findOne({ item_type: olditem_type })
        if (!item) {
            throw new Error(`no item found with type: '${olditem_type}' `)
        }
        item.item_type =item_type
        item.updateAt = createAt
        await item.save()
        // await Items.findOneAndUpdate(, { item_type, createAt })

        res.status(200).send({ code: 200, message: msg })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})

// router.get('/get/:item', async (req, res) => {
//     try {
//         const item_type = req.params.item
//         const item = await Items.find({ item_type: { $regex: `.*${item_type}.*`, $options: 'i' } })
//         res.send(item)
//         console.log(item);
//     } catch (error) {
//         res.send(error.message)
//     }
// })


// delete items 
router.delete('/item/:item', auth, async (req, res) => {
    const item_type = req.params.item.toUpperCase()
    const msg = ' Items deleted'
    try {
        const item = await Items.findOneAndDelete({ item_type })
        if (!item) {
            throw new Error(`No item found with type: '${item_type}' `)
        }
        res.status(200).send({ code: 200, message: msg, data: item })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})

module.exports = router