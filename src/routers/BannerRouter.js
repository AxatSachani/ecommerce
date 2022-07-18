const express = require('express')
const router = express.Router()
const Banner = require('../models/Banner')
const multer = require('multer');


// upload new banner
router.post('/banner',async(req,res)=>{
    var success
    const msg = 'banner created'
    const type = req.body.type
    const image = req.body.image
    try {
        const banner = await Banner({type,image})
        await banner.save()
        success = true
        res.status(201).send({code:201,success:success,message:msg,data:banner})
    } catch (error) {
        success = false
        res.status(400).send({code:400,success:success,message:error.message})
    }
})

// get main banner
router.get('/banner/main',async(req,res)=>{
    const msg = 'all main banner'
    var success 
    console.log('banner-main');
    try {
        const image = await Banner.find({type:'main'}).select({_id:0,image:1})
        success =true
        res.status(200).send({code:200,success:success,message:msg,data:image})
    } catch (error) {
        success= false
        res.status(400).send({code:400,success:success,message:error.message})
    }
})

// get todaydeal banner
router.get('/banner/deals',async(req,res)=>{
    const msg = 'all deals banner'
    var success 
    console.log('banner-deals');

    try {
        const image = await Banner.find({type:'todaydeal'}).select({_id:0,image:1})
        success =true
        res.status(200).send({code:200,success:success,message:msg,data:image})
    } catch (error) {
        success= false
        res.status(400).send({code:400,success:success,message:error.message})
    }
})


// get brand banner
router.get('/banner/brand',async(req,res)=>{
    const msg = 'all brands banner' 
    var success 
    console.log('banner-brand');

    try {
        const image = await Banner.find({type:'brand'}).select({_id:0,image:1})
        success =true
        res.status(200).send({code:200,success:success,message:msg,data:image})
    } catch (error) {
        success= false
        res.status(400).send({code:400,success:success,message:error.message})
    }
})


// get category banner
router.get('/banner/category',async(req,res)=>{
    const msg = 'all categories banner'  
    var success 
    console.log('banner-category');

    try {
        const image = await Banner.find({type:'category'}).select({_id:0,image:1})
        success =true
        res.status(200).send({code:200,success:success,message:msg,data:image})
    } catch (error) {
        success= false
        res.status(400).send({code:400,success:success,message:error.message})
    }
})


module.exports = router














