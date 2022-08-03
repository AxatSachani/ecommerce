const express = require("express");
const multer = require('multer');
const Seller = require("../../models/Seller");
const Photo = require("../../models/Photo");
const router = express.Router()
const SellerRequest = require('../../models/SellerRequest')
const ForgetPassword = require('../../models/ForgetPass');
const SellerRejected = require("../../models/SellerRejected");
const auth = require("../../middleware/Auth");
const uuid = require('uuid-v4')
const bucket = require("../../storage/bucket")



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
}).array('document', 10)



// seller signup (create seller account)
router.post('/seller/account', upload, async (req, res) => {
    const msg = 'new request create for seller account'
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const store_name = req.body.store_name
    const address = req.body.address
    const contact_no = req.body.contact_no
    const emailId = req.body.emailId
    const password = req.body.password
    const file = req.files
    var links = []
    var success
    console.log('seller-req');
    try {
        const seller = await Seller.findOne({ emailId })
        if (seller) {
            throw new Error('already existing')
        }
        const rejectSeller = await SellerRejected.findOne({ emailId })
        if (rejectSeller) {
            throw new Error(`seller alreddy rejected with reason: ${rejectSeller.reject_reason}`)
        }
        const checkSellerRequest = await SellerRequest.findOne({ emailId })
        if (checkSellerRequest) {
            throw new Error(`alreddy requested`)
        }
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
            const link = `https://firebasestorage.googleapis.com/v0/b/ecommerce-3c496.appspot.com/o/${file[i].filename}?alt=media&token=${metadata.metadata.firebaseStorageDownloadTokens}`
            links.push(link)
            console.log(`${file[i].filename} uploaded.`);
        }
        const data = { first_name, last_name, store_name, address, contact_no, emailId, password, document: links }
        const sellerRequest = await SellerRequest(data)
        await sellerRequest.save()
        success = true
        res.status(201).send({ code: 201, success: success, message: msg, data: sellerRequest })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


// signin with seller ID
router.post('/seller/signin', async (req, res) => {
    const emailId = req.body.emailId
    const password = req.body.password
    const msg = 'seller signin successfully'
    var success
    console.log('seller-sigin');
    try {
        const seller = await Seller.findByCredentials(emailId, password)
        const token = await seller.generateAuthToken()
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: seller, token })
    } catch (error) {
        success = false
        res.status(404).send({ code: 404, success: success, message: error.message })
    }
})


// seller signout
router.get('/seller/signout', auth, async (req, res) => {
    const msg = 'seller signout'
    const id = req.body.seller_id
    var success
    try {
        const seller = await Seller.findById(id,)
        if (!seller) {
            throw new Error('Seller not found')
        }
        for (var i = 0; i < seller.tokens.length; i++) {
            const token = seller.tokens[i].token == req.header('Authorization')
            if (token) {
                seller.tokens.splice(i, 1)
                break;
            }
        }
        await seller.save()
        success = true
        res.status(200).send({ code: 200, success: success, message: msg })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


//update seller profile
router.put('/seller/:id', auth, async (req, res) => {
    const id = req.params.id
    const msg = 'data updated'
    const update_field = Object.keys(req.body)
    const allowUpdate = ['first_name', 'last_name', 'emailId', 'contact_no', 'password']
    const updateValidation = update_field.every((update_field) => allowUpdate.includes(update_field))
    if (!updateValidation) {
        throw new Error('check field')
    }
    var success
    console.log('seller-update');
    try {
        const seller = await Seller.findById(id)
        if (!seller) {
            throw new Error(`not found.`)
        }
        update_field.forEach((update_field) => {
            seller[update_field] = req.body[update_field]
        })
        await seller.save()
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: seller })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})


module.exports = router