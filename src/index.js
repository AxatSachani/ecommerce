
const express = require('express')
const app = express()

// Admin Routers
const AdminRoter = require('./routers/Admin/AdminRouter')
const ItemRouter = require('./routers/Admin/ItemRouter')
const SubItemRouter = require('./routers/Admin/SubItemRouter')
const SubChildRouter = require('./routers/Admin/SubChildRouter')
const BannerRouter = require('./routers/Admin/BannerRouter');
const ForgetPasswordRouter = require('./routers/ForgetPasswordRouter')
const AdminDashBoard = require('./routers/Admin/DashBoard')
const SellerData = require('./routers/Admin/Seller')
const CouponRouter = require('./routers/Admin/CouponRouter')

// Seller Routers
const SellerRouter = require('./routers/Seller/SellerRouter')
const ProductRouter = require('./routers/Seller/ProductRouter')
const SellerDashBoard = require('./routers/Seller/DashBoard')


// User Routers
const UserRouter = require('./routers/User/UserRouter')
const CartRouter = require('./routers/User/CartRouter')
const WhishlistRouter = require('./routers/User/WhishlistRouter')
const AddressRouter = require('./routers/User/AddressRouter')
const OrderRouter = require('./routers/User/OrderRouter')
const PaymentRouter = require('./routers/User/PaymentRouter')
const FindProductRouter = require('./routers/User/FindProductRouter')


// Other Routers
const Photo = require('./routers/photo')
const Backup = require('./routers/BackupRouter');
const DemoRouter = require('./routers/DemoRouter')






// Admin 
app.use(AdminRoter)
app.use(ItemRouter)
app.use(SubItemRouter)
app.use(SubChildRouter)
app.use(BannerRouter)
app.use(ForgetPasswordRouter)
app.use(AdminDashBoard)
app.use(SellerData)
app.use(CouponRouter)


//Seller
app.use(SellerRouter)
app.use(ProductRouter)
app.use(SellerDashBoard)


// User
app.use(UserRouter)
app.use(CartRouter)
app.use(WhishlistRouter)
app.use(AddressRouter)
app.use(OrderRouter)
app.use(PaymentRouter)
app.use(FindProductRouter)



// Other
app.use(Photo)
app.use(Backup)
app.use(DemoRouter)