const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')
const Seller = require('../models/Seller')
const User = require('../models/User')

// check authorization
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')
        const decoded = jwt.verify(token, 'token')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        const seller = await Seller.findOne({ _id: decoded._id, 'tokens.token': token })
        const admin = await Admin.findOne({ _id: decoded._id, 'tokens.token': token })

        if (user) {
            req.user = user
            console.log('user');
        } else if (seller) {
            req.seller = seller
            console.log('seller');
        } else if (admin) {
            req.admin = admin
            console.log('admin');
        } else {
            throw new Error('unauthorized access')
        }
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({ code: 401, message: 'unauthorized access' })
    }
}


module.exports = auth