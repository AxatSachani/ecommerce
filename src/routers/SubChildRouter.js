const express = require("express");
const router = express.Router()
const SubChild = require('../models/SubChildItem')
const auth = require('../middleware/Auth');
const SubItems = require("../models/SubItems");
const Items = require("../models/Items");


// add subChild
router.post('/add/sub-Child', auth, async (req, res) => {
    const subChild_type = req.body.subChild_type.toUpperCase()
    const subItem_type = req.body.subItem_type.toUpperCase()
    const item_type = req.body.item_type.toUpperCase()
    const msg = 'subChild created'
    var success
    console.log('subchild-add');
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
        success = true
        res.status(201).send({ code: 201, success: success, message: msg, data: subChild })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})



//get all subChild
router.get('/sub-Child/:item_type/:subItem_type', auth, async (req, res) => {
    const msg = 'all subChild type'
    const item_type = req.params.item_type
    const subItem_type = req.params.subItem_type
    var success
    console.log('subchild-get');
    try {
        const subChild = await SubChild.find({ item_type, subItem_type }).select({ _id: 0, subChild_type: 1 })
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: subChild })
    } catch (error) {
        success = false
        res.status(404).send({ code: 404, success: success, message: error.message })
    }
})

// Update
router.put('/sub-child', auth, async (req, res) => {
    const item_type = req.body.item_type.toUpperCase()
    const subItem_type = req.body.subItem_type.toUpperCase()
    const subChild_type = req.body.oldsubChild_type.toUpperCase()
    const newsubChild_type = req.body.newsubChild_type.toUpperCase()
    const msg = 'updated successfully'
    var success
    console.log('subchild-update');
    try {
        const subChild = await SubChild.findOneAndUpdate({ subChild_type, subItem_type, item_type }, { subChild_type: newsubChild_type })
        if (!subChild) {
            throw new Error(`Something wrong. Check types`)
        }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})

//delete
router.delete('/sub-child/:item/:type/:child', auth, async (req, res) => {
    const item_type = req.params.item.toUpperCase()
    const subItem_type = req.params.type.toUpperCase()
    const subChild_type = req.params.child.toUpperCase()
    const msg = 'delete successfully'
    var success
    console.log('subchild-del');
    try {
        const subChild = await SubChild.findOneAndDelete({ subChild_type, subItem_type, item_type })
        if (!subChild) {
            throw new Error(`No item found with type: '${item_type}','${subItem_type}','${subChild_type}' `)
        }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: subChild })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})

module.exports = router