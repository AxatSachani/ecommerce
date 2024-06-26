const express = require("express");
const Whishlist = require("../../models/Whishlist");
const Product = require("../../models/Product");
const User = require("../../models/User");
const auth = require("../../middleware/Auth");
const router = express.Router()


// add to whishlist
router.post('/add/whishlist', auth, async (req, res) => {
    const user_id = req.body.user_id
    const product_id = req.body.product_id
    const msg = 'Whishilist added'
    var success
    console.log('whish-add');
    try {
        const user = await User.findById(user_id)
        if (!user) {
            throw new Error('User not found')
        }
        productDetails = await Product.findById(product_id)
        if (!productDetails) {
            throw new Error('invalid product id')
        }
        const seller_id = productDetails.seller_id
        const product_brand = productDetails.product_details.name
        const product_name = productDetails.product_details.description
        const product_banner = productDetails.product_details.banner
        const product_price = productDetails.product_price
        const whishListDetails = { user_id, product_id, seller_id, product_brand, product_name, product_banner, product_price }
        const whishlist = await Whishlist(whishListDetails)
        await whishlist.save()
        success = true
        res.status(201).send({ code: 201, success: success, message: msg, data: whishlist })
    } catch (error) {
        success = false
        res.status(400).send({ code: 400, success: success, message: error.message })
    }
})



// delete whishlist
router.delete('/user/whishlist/delete/:id', auth, async (req, res) => {
    const msg = 'Whishlist deleted'
    const whishlist_id = req.params.id
    var success
    console.log('whish-del');
    try {
        const whishlist = await Whishlist.findByIdAndDelete(whishlist_id)
        if (!whishlist) {
            throw new Error('invalid whishlist id')
        }
        success = true
        res.status(200).send({ code: 200, success: success, message: msg })
    } catch (error) {
        success = false
        res.status(404).send({ code: 404, success: success, message: error.message })
    }
})

// get user-whishlist by userID
router.get('/user/whishlist/:id', auth, async (req, res) => {
    const msg = 'User Whishlist'
    const user_id = req.params.id
    var success
    console.log('whish-get');
    try {
       
        const user = await User.findById(user_id)
        if (!user) {
            throw new Error('user not found')
        }
        const whishlist = await Whishlist.find({ user_id }).select({ user_id: 0 })
        success = true
        res.status(200).send({ code: 200, success: success, message: msg, data: whishlist })
    } catch (error) {
        success = false
        res.status(404).send({ code: 404, success: success, message: error.message })
    }
})



module.exports = router




// delete product from whishlist
// router.delete('/delete/whishlist-product', async (req, res) => {
//     const product_number = req.body.product_number
//     const whishlist_id = req.body.whishlist_id
//     const msg = 'Whishlist updated'
//     try {
//         const whishlist = await Whishlist.findById(whishlist_id)
//         if (!whishlist.products[product_number]) {
//             throw new Error('invalid product number')
//         } else {
//             whishlist.products.splice(product_number, 1)
//             await whishlist.save()
//             res.status(200).send({ code: 200, message: msg })
//         }
//     } catch (error) {
//         res.status(400).send({ code: 400, message: error.message })
//     }
// })



// get user-whishlist
// router.get('/get/user-whishlist', async (req, res) => {
//     const msg = 'User Whishlist'
//     try {
//         const whishlist = await User.aggregate([
//             {
//                 $project: {
//                     _id: 1
//                 }
//             },
//             {
//                 $lookup: {
//                     from: Whishlist.collection.name,
//                     localField: '_id',
//                     foreignField: 'user_id',
//                     as: 'User Whishlist'
//                 }
//             },

//         ])
//         res.status(200).send({ code: 200, message: msg, data: whishlist })
//     } catch (error) {
//         res.status(404).send({ code: 404, message: error.message })
//     }
// })





// const whishlistCheck = await Whishlist.findOne({ user_id })
        // if (!whishlistCheck) {
        //     const whishListDetails = { user_id, products: { product_id, seller_id, product_name, product_price } }
        //     const whishlist = await Whishlist(whishListDetails)
        //     await whishlist.save()
        //     res.status(201).send({ code: 201, message: msg, data: whishlist })
        // } else {
        //     const whishListDetails = { product_id, seller_id, product_name, product_price }
        //     whishlistCheck.products.push(whishListDetails)
        //     await whishlistCheck.save()
        //     const whishlist = whishlistCheck
        //     res.status(201).send({ code: 201, message: msg, data: {user_id,whishlist} })
        // }