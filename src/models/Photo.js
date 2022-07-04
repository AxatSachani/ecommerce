const mongoose = require('mongoose')




const PhotoSchema = new mongoose.Schema({
    photo: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    }
})

const Photo = mongoose.model('Photo', PhotoSchema)

module.exports = Photo