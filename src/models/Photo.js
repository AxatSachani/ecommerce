const mongoose = require('mongoose')




const PhotoSchema = new mongoose.Schema({
 
    document: {
        type: Array
    }
})

const Photo = mongoose.model('Photo', PhotoSchema)

module.exports = Photo