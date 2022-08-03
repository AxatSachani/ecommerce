const mongoose = require("mongoose");
const moment = require('moment')

const CouponSchema = new mongoose.Schema({

    coupon_code: {
        type: String
    },
    coupon_type: {
        type: String
    },
    discount: {
        type: String
    },
    condition: {
        type: String
    },
    description: {
        type: String
    },
    startDate: {
        type: String,
        default: moment(Date.now()).format('DD/MM/YYYY')
    },
    EndDate: {
        type: String
    }
}

)

const Coupon = mongoose.model('Coupon', CouponSchema)
module.exports = Coupon