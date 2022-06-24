const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const AddProductSchema = new mongoose.Schema({
    seller_id: {
        type: ObjectId,
        required: true
    },
    product_details: {
        type:Object,
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
    },
    size_quantity: [{
        type: Object,
        size: {
            type: String
        },
    }],
    product_price: {
        type: Number,
        required: true
    },
    subChild_type: {
        type: String,
        required: true,
        uppercase: true
    },
    sub_category: {
        type: String,
        required: true,
        uppercase: true
    },
    item_category: {
        type: String,
        required: true,
        uppercase: true
    }

    //sellerID, product_details, product_price, live_quantity, subChild_type, sub_category, item_category

    // name , description ,size, 

})

const Product = mongoose.model('Product', AddProductSchema)
module.exports = Product