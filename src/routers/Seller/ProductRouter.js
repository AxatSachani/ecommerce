const express = require("express");
const res = require("express/lib/response");
const auth = require("../../middleware/Auth");
const Items = require("../../models/Items");
const router = express.Router()
const Product = require('../../models/Product');
const SubChild = require("../../models/SubChildItem");
const SubItems = require("../../models/SubItems");
const uuid = require('uuid-v4');
const multer = require('multer')
var bucket = require("../../storage/bucket");


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
        if (!file.originalname.match(/\.(png|jpeg|jpg|pdf)$/)) {
            return cb(new Error('incorrect file format'))
        }
        cb(undefined, true)
    }
}).array('document', 10)

// add product by seller 
router.post('/add/product', upload, auth, async (req, res) => {
    const msg = 'Product added'
    const subChild_type = req.body.subChild_type
    const subItem_type = req.body.subItem_type
    const item_type = req.body.item_type
    const file = req.files
    const filename = req.files
    var links = []
    var images = true
    console.log('pro-add');
    try {
        if (item_type) {
            images = false
        }
        if (images) {
            for (let i = 0; i < file.length; i++) {
                const metadata = {
                    metadata: {
                        firebaseStorageDownloadTokens: uuid()
                    },
                    contentType: 'image/png',
                    cacheControl: 'public, max-age=31536000',
                };
                bucket.upload(file[i].path, {
                    gzip: true,
                    metadata: metadata,
                });
                const link = `https://firebasestorage.googleapis.com/v0/b/ecommerce-3c496.appspot.com/o/${filename[i].filename}?alt=media&token=${metadata.metadata.firebaseStorageDownloadTokens}`
                links.push(link)
                console.log(`${filename[i].filename} uploaded.`);
            }
            const msg1 = 'image upload'
            success = true
            res.status(200).send({ code: 200, success: success, message: msg1, data: links })
        } else {
            const typecheck = await SubChild.find({ subChild_type, subItem_type, item_type })
            if (!typecheck) {
                throw new Error('Invalid types')
            }
            const product = await Product(req.body)
            await product.save()
            success = true
            res.status(201).send({ code: 201, success: success, message: msg, data: product })
        }
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})

// get all product
router.get('/products', auth, async (req, res) => {
    const msg = 'all products'
    var success
    console.log('pro-all');
    try {
        const products = await Product.find().select({ _id: 1, product_details: 1, product_price: 1 })
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: products })
    } catch (error) {
        success = false
        res.status(404).send({ code: 404, success: success, message: error.message })
    }
})


// product details
router.get('/product/:id', auth, async (req, res) => {
    const msg = 'product details'
    var alert_message
    const product_id = req.params.id
    var success
    console.log('pro-deteils');
    try {
        const product = await Product.findById(product_id)
        if (!product) {
            throw new Error('product not found')
        }
        const quantity = product.quantity
        const livequantity = product.livequantity
        if (livequantity <= quantity && livequantity >= ((quantity * 50) / 100)) {
            alert_message = `In Stock!`
        }
        if (livequantity < ((quantity * 50) / 100) && livequantity > ((quantity * 15) / 100)) {
            alert_message = `Hurry up! few left..`
        }
        if (livequantity < ((quantity * 15)) / (100 && livequantity > 0)) {
            alert_message = `Only ${livequantity} left in stock`
        }
        if (livequantity == 0) {
            alert_message = `Out of stock !`
        }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: { alert_message, product } })
    } catch (error) {
        success = false
        res.status(404).send({ code: 404, success: success, message: error.message })
    }
})

module.exports = router
