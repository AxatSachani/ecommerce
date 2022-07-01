const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')


const WhishlistSchema = new mongoose.Schema({

    user_id: {
        type: ObjectId,
        required: true
    },
    products: {
        product_id: {
            type: ObjectId,
            required: true
        },
        seller_id: {
            type: ObjectId
        },
        product_name: {
            type: String
        },
        product_price: {
            type: Number
        },
    },


})
const Whishlist = mongoose.model('Whishlist', WhishlistSchema)
module.exports = Whishlist