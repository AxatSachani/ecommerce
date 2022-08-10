const express = require("express");
const router = express.Router()
const SubChild = require('../../models/SubChildItem')
const auth = require('../../middleware/Auth');
const SubItems = require("../../models/SubItems");
const Items = require("../../models/Items");
const { item_type, toFormat } = require('../../module/module')

// add subChild
router.post('/sub-Child/add', auth, async (req, res) => {
    const type = req.body.subChild_type
    const subChild_type = toFormat(type)
    const subItem_type = req.body.subItem_type.toUpperCase()
    const item_type = req.body.item_type
    const addedBy = req.body.addedBy
    const msg = 'subChild created'
    var success
    console.log('sub-child/add');
    try {
        console.log(item_type, subItem_type, subChild_type);
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
        const data = { subChild_type, subItem_type, item_type, addedBy }
        const subChild = await SubChild(data)
        await subChild.save()
        success = true
        res.status(201).send({ code: 201, success: success, message: msg, data: subChild })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})



//get all subChild
router.post('/sub-child/', auth, async (req, res) => {
    const msg = 'all subChild type'
    const type = req.body.item_type
    const item_type = toFormat(type)
    const subItem_type = req.body.subItem_type.toUpperCase()
    var success, subChilds = []
    console.log('subchild-get');
    try {
        const subChild = await SubChild.find({ item_type, subItem_type })
        for (let i = 0; i < subChild.length; i++) {
            subChilds.push(subChild[i].subChild_type)
        }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: subChilds })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


// all subChild details
router.get('/sub-child/allsub-child', async (req, res) => {
    var success
    const msg = 'data'
    console.log('subChild-details');
    try {
        const subItems = await SubChild.aggregate(
            [
                {
                    $group: {
                        _id: { item_type: "$item_type", subItem_type: "$subItem_type" },
                        group: {
                            $push: {
                                item_type: "$item_type", subItem_type: "$subItem_type", subChild_type: "$subChild_type", createAt: "$createAt"
                            }
                        }
                    }
                },
                {
                    $sort: {
                        _id: 1
                    }
                }
            ]);
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: subItems })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})

// Update
router.put('/sub-child/update', auth, async (req, res) => {
    const type = req.body.item_type
    const item_type = toFormat(type)
    const subItem_type = req.body.subItem_type.toUpperCase()
    const type1 = req.body.oldsubChild_type
    const subChild_type = toFormat(type1)
    const type2 = req.body.newsubChild_type
    const newsubChild_type = toFormat(type2)
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
router.delete('/sub-child/delete/:itemType/:subType/:childType', auth, async (req, res) => {
    const type = req.params.itemType
    const item_type = toFormat(type)
    const subItem_type = req.params.subType.toUpperCase()
    const subChild_type = req.params.childType
    const msg = 'delete successfully'
    var success
    console.log('subchild-del');
    try {
        const subChild = await SubChild.findOneAndDelete({ subChild_type, subItem_type, item_type })
        if (!subChild) {
            throw new Error(`No item found with type: '${item_type}','${subItem_type}','${subChild_type}' `)
        }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})

module.exports = router