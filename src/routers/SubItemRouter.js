const express = require("express");
const moment = require('moment')
const SubItems = require("../models/SubItems");
const router = express.Router()
const auth = require('../middleware/Auth');
const Items = require("../models/Items");

//add new subItem-type
router.post('/add/subitem', auth,async (req, res) => {
    const subItem_type = req.body.subItem_type.toUpperCase()
    const item_type = req.body.item_type
    const msg = 'SubItem created'
    var success
    console.log('subitem-add');
    try {
        const item = await Items.findOne({item_type})
        if(!item){
            throw new Error(`No item type found: ${item_type}`)
        }
        const already_type = await SubItems.findOne({ subItem_type,item_type })
        // const already_type = await SubItems.findOne({ subItem_type: { $regex: subItem_type, $options: 'i' }, item_type: { $regex: item_type, $options: 'i' } })
        if (already_type) {
            throw new Error(`Sub-item '${subItem_type}' already existing`)
        }
        const subItem = await SubItems(req.body)
        await subItem.save()
        success= true
        res.status(201).send({ code: 201,success:success, message: msg, data: subItem })
    } catch (error) {
        success= false
        res.status(400).send({ code: 400,success:success, message: error.message })
    }
})

// get all subitems
router.get('/subitems/:item_type',auth, async (req, res) => {
    const msg = 'all subItems data'
    const item_type= req.params.item_type
    var success
    console.log('subitem-get');
    try {
        const subItems = await SubItems.find({item_type}).select({_id:0,subItem_type:1})
        success= true
        res.status(200).send({ code: 200, success:success,message: msg, data: subItems })
    } catch (error) {
        success= false
        res.status(404).send({ code: 404, success:success,message: error.message })
    }
})

// update subitems
router.put('/subitem/',auth, async (req, res) => {
    const item_type = req.body.item_type.toUpperCase()
    const oldsubItem_type = req.body.oldsubItem_type.toUpperCase()
    const newsubItem_type = req.body.newsubItem_type
    const updateAt = moment(Date.now()).format('DD/MM/YYYY hh:mm a')
    const msg = 'subItem updated'
    var success
    console.log('subitem-update');
    try {
        const subItem = await SubItems.findOne({ subItem_type: oldsubItem_type, item_type: item_type })
        if(!subItem){
            throw new Error(`No item found with type: '${item_type}','${oldsubItem_type}' `)
        }
        subItem.subItem_type =newsubItem_type
        subItem.updateAt = updateAt
        await subItem.save()
        success= true
        res.status(200).send({ code: 200,success:success, message: msg })
    } catch (error) {
        success= false
        res.status(400).send({ code: 400,success:success, message: error.message })
    }
})

// delete subitems
router.delete('/subitem/:item/:type', auth,async (req, res) => {
    const item_type = req.params.item.toUpperCase()
    const subItem_type = req.params.type.toUpperCase()
    const msg = 'subItem deleted'
    var success
    console.log('subitem-del');
    try {
        const subItem = await SubItems.findOneAndDelete({ subItem_type, item_type })
        if (!subItem) {
            throw new Error(`No item found with type: '${item_type}','${subItem_type}' `)
        }
        success= true
        res.status(200).send({ code: 200,success:success, message: msg, data: subItem })
    } catch (error) {
        success= false
        res.status(400).send({ code: 400,success:success, message: error.message })
    }
})

module.exports = router