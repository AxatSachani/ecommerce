const express = require("express");
const router = express.Router()
const mongoose = require('mongoose')
const cron = require('node-cron');
const { i } = require('../models/demo')
const { CourierClient } = require("@trycourier/courier");
const res = require("express/lib/response");
const User = require("../models/User");

var bucket = require("../storage/bucket");
const uuid = require('uuid-v4');
const multer = require('multer');
const Coupon = require("../models/Coupon");


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
router.post('/imagepost', upload, async (req, res) => {
    const msg = 'uplaod'
    const file = req.files
    console.log(file);
    const filename = req.files
    var links = []
    try {
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

        res.status(201).send({ code: 201, message: msg, links })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})



router.post('/mail', async (req, res) => {
    const courier = CourierClient({ authorizationToken: process.env.EMAIL_TOKEN });

    const { requestId } = courier.send({
        message: {
            to: {
                email: "beactakshat@gmail.com",
            },
            template: "EVCR08MEWQ4F4CM7TFNXEV1YGAAY",
            data: {
                message: "Akshat",
                password: 'this is message'
            },
        },
    });
    console.log(JSON.stringify(requestId));
    res.send({ done: requestId })
})
var courier = CourierClient({ authorizationToken: process.env.EMAIL_TOKEN });
var email = function (email) {
    courier.send({
        message: {
            to: {
                email: email,
            },
            template: "EVCR08MEWQ4F4CM7TFNXEV1YGAAY",
            data: {
                message: "Akshat",
                password: 'this is message'
            },
        },
    });
}
router.post('/notification', async (req, res) => {
    var success
    const msg = 'send notification'
    const _id = '62d7d0d5cd3a77508c43fd29'
    try {
        const user = await User.findOne({ _id })
        const user_dob = user.DOB.split('/')
        const emailId = user.emailId
        cron.schedule(`32 16 ${user_dob[0]} ${user_dob[1]} *`, async function () {
            const id = email(emailId)
            console.log('here');
            console.log(JSON.stringify(id));
        })
        // msg1.start()
        success = true
        res.status(200).send({ code: 200, success: success, message: msg })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})

// const ed = '31/07/2022'
// const td = '31/08/2022'

// if (td > ed) {
//     console.log('expired');
// }
// console.log('here');

// {const fs = require('fs')

// const data = fs.readFileSync('./src/image/dress1659349872421.png','utf16le')
// console.log(data.length);

// const buffer = Buffer.from(data,'ucs-2')
// console.log(buffer);

// fs.writeFileSync('image.png',buffer)}


module.exports = router
