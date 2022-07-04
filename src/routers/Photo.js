const express = require("express");
const router = express.Router()
// const multer = require('multer')

const multer = require('multer');
const res = require('express/lib/response');
const upload = multer({
    // dest: 'images',
    limits: {
        fileSize: 8000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png)$/)) {
            return cb(new Error('InCorrect file format'))
        }
        cb(undefined, true)
    }
})
router.post('/upload', upload.single('upload'), async (req, res) => {
    const avatar = req.file
    console.log(avatar);
    res.send()
}, (err, req, res, next) => {
    res.status(400).send({ error: err })
})


module.exports = router



// const upload = multer({
//     limits: {
//         fileSize: 8000000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(png)$/)) {
//             return cb(new Error('InCorrect file format'))
//         }
//         cb(undefined, true)
//     }
// })


// router.post('/upload', upload.single('upload'), async (req, res) => {
//     const photo = req.file
//     console.log(photo);
//     res.send(photo)
// })