const express = require('express')
require('dotenv').config()
const moment = require('moment')
const bodyParser = require('body-parser');
require('./database/database')
const cron = require('node-cron');
const chalk = require('chalk')



// Admin Routers
const AdminRoter = require('./routers/Admin/AdminRouter')
const ItemRouter = require('./routers/Admin/ItemRouter')
const SubItemRouter = require('./routers/Admin/SubItemRouter')
const SubChildRouter = require('./routers/Admin/SubChildRouter')
const BannerRouter = require('./routers/Admin/BannerRouter');
const ForgetPasswordRouter = require('./routers/Admin/ForgetPasswordRouter')
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
const DemoRouter = require('./routers/DemoRouter');


const app = express()
app.use(express.json())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', false);
    next();
});


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



// cron.schedule(`0 * * * *`, () => {
//     rimraf("src/image", function () { console.log("done"); });

// })



var port = process.env.PORT
var host = process.env.HOST

const time = moment(Date.now()).format('hh:mm:ss')
app.listen(port, '0.0.0.0', () => {
    console.log(chalk.yellow(`server running on `), chalk.magenta(`http://${host}:${port}`), `( last start:`, chalk.yellow(`${time}`), `)`);
})

//11000000.10101000.11101.10
app.get('/', async (req, res) => {
    res.send(`ecommerce server running on  http://${host}:${port}/`)
})