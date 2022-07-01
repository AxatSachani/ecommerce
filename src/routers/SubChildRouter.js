const express = require("express");
const router = express.Router()
const SubChild = require('../models/SubChildItem')
const auth = require('../middleware/Auth');
const SubItems = require("../models/SubItems");
const Items = require("../models/Items");


// add subChild
router.post('/add/subChild', auth, async (req, res) => {
    const subChild_type = req.body.subChild_type.toUpperCase()
    const subItem_type = req.body.subItem_type.toUpperCase()
    const item_type = req.body.item_type.toUpperCase()
    const msg = 'subChild created'
    try {
        const already_type = await SubChild.findOne({ subChild_type, subItem_type, item_type })
        if (already_type) {
            throw new Error(`Sub-item '${subChild_type}' already existing`)
        }
        const subItem_typeCheck = await SubItems.findOne({ subItem_type, item_type })
        if (!subItem_typeCheck) {
            throw new Error(`SubItem '${subItem_type}' is not existing`)
        }
        const item_typeCheck = await Items.findOne({ item_type })
        if (!item_typeCheck) {
            throw new Error(`Item '${item_type}' is not existing`)
        }
        const subChild = await SubChild(req.body)
        await subChild.save()
        res.status(201).send({ code: 201, message: msg, data: subChild })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})


//get all subChild
router.get('/get/subChild', auth, async (req, res) => {
    const msg = 'all subChild type'
    try {
        const subChild = await SubChild.find()
        const count = await SubChild.find().countDocuments()
        res.status(200).send({ code: 200, message: msg, totalSubChild: count, data: subChild })
    } catch (error) {
        res.status(404).send({ code: 404, message: error.message })
    }
})

// Update
router.patch('/update/:item/:type/:child', auth, async (req, res) => {
    const item_type = req.params.item.toUpperCase()
    const subItem_type = req.params.type.toUpperCase()
    const subChild_type = req.params.child.toUpperCase()
    const msg = 'updated successfully'
    try {
        const subChild = await SubChild.findOneAndUpdate({ subChild_type, subItem_type, item_type }, req.body)
        if (!subChild) {
            throw new Error(`Something wrong. Check types`)
        }
        res.status(200).send({ code: 200, message: msg })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})

//delete
router.delete('/delete/:item/:type/:child', auth, async (req, res) => {
    const item_type = req.params.item.toUpperCase()
    const subItem_type = req.params.type.toUpperCase()
    const subChild_type = req.params.child.toUpperCase()
    const msg = 'delete successfully'
    try {
        const subChild = await SubChild.findOneAndDelete({ subChild_type, subItem_type, item_type })
        if (!subChild) {
            throw new Error(`No item found with type: '${item_type}','${subItem_type}','${subChild_type}' `)
        }
        res.status(200).send({ code: 200, message: msg, data: subChild })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})

module.exports = router