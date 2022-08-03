const express = require('express')
const router = express.Router()
const Banner = require('../../models/Banner')
const multer = require('multer');
const auth = require('../../middleware/Auth');
const bucket = require("../../storage/bucket")
const uuid = require('uuid-v4');
const SubChild = require('../../models/SubChildItem');
const Product = require('../../models/Product');


const storage = multer.diskStorage({
    destination: `src/image`,
    filename: function (req, file, cb) {
        const filename = file.originalname.split('.')
        for (var i = 0; i < filename[0].length; i++) {
            if (filename[i] == " ") {
                throw new Error('invalid name')
            }
        }
        cb(null, `${filename[0]}${Date.now()}.png`)
    }
})
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 8000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
            return cb(new Error('incorrect file format'))
        }
        cb(undefined, true)
    }
}).single('image')




// upload new banner
router.post('/banner', auth, upload, async (req, res) => {
    var success
    const file = req.file
    const msg = 'banner created'
    const brand_name = req.body.brand_name
    const item_type = req.body.item_type
    const subchild_type = req.body.subchild_type
    const subItem_type = req.body.subItem_type
    const type = req.body.type
    console.log('add banner');
    try {
        const metadata = {
            metadata: {
                firebaseStorageDownloadTokens: uuid()
            },
            contentType: 'image/png',
            cacheControl: 'public, max-age=31536000',
        };
        bucket.upload(file.path, {
            gzip: true,
            metadata: metadata,
        });
        var link = `https://firebasestorage.googleapis.com/v0/b/ecommerce-3c496.appspot.com/o/${file.filename}?alt=media&token=${metadata.metadata.firebaseStorageDownloadTokens}`

        // success = true
        // res.status(200).send({ code: 200, success: success, message: msg1, data: links })

        const data = { brand_name, item_type, subItem_type, subchild_type, type, image: link }

        const banner = await Banner(data)
        await banner.save()
        success = true
        res.status(201).send({ code: 201, success: success, message: msg, data: banner })

    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})

// get  banner
router.get('/banner/', auth, async (req, res) => {
    const type = req.query.type
    const msg = `all ${type} banner`
    var success
    console.log('banner');
    try {
        const image = await Banner.find({ type }).select({})
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: image })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


// subChild type via item type
router.get('/subChild', auth, async (req, res) => {
    const msg = 'sub-child type'
    console.log('subChild via item');
    var success
    const item_type = req.body.item_type
    try {
        const subChild_type = await SubChild.find({ item_type }).select({ subChild_type: 1, _id: 0 })
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: subChild_type })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})

// get brand name
router.get('/brand/name', auth, async (req, res) => {
    var success
    const msg = 'brand name'
    var brand = []
    try {
        const product = await Product.find({})
        for (let i = 0; i < product.length; i++) {
            const name = product[i].product_details.name
            brand.push(name)
        }
        brand = brand.filter((value, index) => brand.indexOf(value) === index)
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: brand })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


// // get todaydeal banner
// router.get('/banner/deals', auth, async (req, res) => {
//     const msg = 'all deals banner'
//     var success
//     console.log('banner-deals');

//     try {
//         const image = await Banner.find({ type: 'todaydeal' }).select({ _id: 0, image: 1 })
//         success = true
//         res.status(200).send({ code: 200, success: success, message: msg, data: image })
//     } catch (error) {
//         success = false
//         res.status(400).send({ code: 400, success: success, message: error.message })
//     }
// })


// // get brand banner
// router.get('/banner/brand', auth, async (req, res) => {
//     const msg = 'all brands banner'
//     var success
//     console.log('banner-brand');

//     try {
//         const image = await Banner.find({ type: 'brand' }).select({ _id: 0, image: 1 })
//         success = true
//         res.status(200).send({ code: 200, success: success, message: msg, data: image })
//     } catch (error) {
//         success = false
//         res.status(400).send({ code: 400, success: success, message: error.message })
//     }
// })


// // get category banner
// router.get('/banner/category', auth, async (req, res) => {
//     const msg = 'all categories banner'
//     var success
//     console.log('banner-category');

//     try {
//         const image = await Banner.find({ type: 'category' }).select({ _id: 0, image: 1 })
//         success = true
//         res.status(200).send({ code: 200, success: success, message: msg, data: image })
//     } catch (error) {
//         success = false
//         res.status(400).send({ code: 400, success: success, message: error.message })
//     }
// })


// get all banner
// router.get('/banner', auth, async (req, res) => {
//     const msg = 'banner'
//     try {
//         const homePage_banner = await Banner.find({ type: 'main' }).select({ _id: 0, image: 1 })
//         const deal_banner = await Banner.find({ type: 'todaydeal' }).select({ _id: 0, image: 1 })
//         const brand_banner = await Banner.find({ type: 'brand' }).select({ _id: 0, image: 1 })
//         const category_banner = await Banner.find({ type: 'category' }).select({ _id: 0, image: 1 })
//         success = true
//         res.status(200).send({ code: 200, success: success, message: msg, data: { homePage_banner, deal_banner, brand_banner, category_banner } })
//     } catch (error) {
//         success = false
//         res.status(400).send({ code: 400, success: success, message: error.message })
//     }
// })


module.exports = router


// banner_type = main,deals,brand,category














