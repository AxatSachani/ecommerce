const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const Photo = require('../models/Photo')
const router = express.Router()

var upload = multer({
    limits: {
        fileSize: 8000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|pdf)$/)) {
            return cb(new Error('InCorrect file format'))
        }
        cb(undefined, true)
    }
})
// const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
router.post('/photo', upload.array('document', 12), async (req, res) => {
    const document = req.files
    try {
       const upload = (req,res,function(err){
            if(err){
                console.log(err);
            }else{
                console.log(req.body);
                console.log(req.files);
            }
        })
        upload()
        const photo = await Photo({document}).save()
        res.send('done')
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})


router.get('/get/photo', async (req, res) => {
    try {
        const photo = await Photo.find({}).select({ _id: 0 })
        // const p = photo.document
        // console.log(photo);

        res.set('Content-type', 'image/png')
        res.status(200).send({ code: 200, message: 'done', data: photo })
    } catch (error) {
        res.status(404).send({ code: 404, message: error.message })
    }
})
module.exports = router