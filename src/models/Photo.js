const mongoose = require('mongoose')




const PhotoSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    document: {
        type: Array
    }
})

const Photo = mongoose.model('Photo', PhotoSchema)

module.exports = Photo