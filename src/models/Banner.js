const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({

    brand_name: {
        type: String
    },
    item_type: {
        type: String
    },
    subItem_type: {
        type: String
    },
    subchild_type: {
        type: String
    },
    type: {
        type: String
    },
    image: {
        type: String
    }

})

const Banner = mongoose.model('Banner', BannerSchema)
module.exports = Banner



/*Main:- brand-name, image
Deals:- brand-name, image
category:- item-type, subchild-type, image
Brands = brand-name, image*/


// brand-name,item-type,subChild-type,image,type