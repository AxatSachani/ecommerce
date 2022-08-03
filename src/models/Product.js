const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const AddProductSchema = new mongoose.Schema({
    seller_id: {
        type: ObjectId,
        required: true
    },
    product_details: {
        type: Object,
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        banner: {
            type: String
        }
    },
    image: [{
        type: String
    }],
    size: [{
        type: String,
        uppercase: true
    }],
    quantity: {
        type: Number
    },
    livequantity: {
        type: Number
    },
    product_price: {
        type: Number,
        required: true
    },
    delivery_option: [{
        type: String
    }],
    details: {
        type: String
    },
    features: [{
        type: String
    }],
    tag: [{
        type: String,
        lowercase:true
    }],
    subChild_type: {
        type: String,
        required: true,
    },
    subItem_type: {
        type: String,
        required: true,
        uppercase: true
    },
    item_type: {
        type: String,
        required: true,
    }

})




// filter response data
AddProductSchema.methods.toJSON = function () {
    const product = this
    const productData = product.toObject()
    delete productData.__v
    return productData
}

const Product = mongoose.model('Product', AddProductSchema)
module.exports = Product