
const express = require('express')
const app = express()

const AdminRoter = require('./routers/AdminRouter')
const ItemRouter = require('./routers/ItemRouter')
const SubItemRouter = require('./routers/SubItemRouter')
const SubChildRouter = require('./routers/SubChildRouter')
const SellerRouter = require('./routers/SellerRouter')
const ProductRouter = require('./routers/ProductRouter')
const UserRouter = require('./routers/UserRouter')
const CartRouter = require('./routers/CartRouter')
const WhishlistRouter = require('./routers/WhishlistRouter')
const AddressRouter = require('./routers/AddressRouter')
const OrderRouter = require('./routers/OrderRouter')
const PaymentRouter = require('./routers/PaymentRouter')
const ForgetPasswordRouter = require('./routers/ForgetPasswordRouter')
const Photo = require('./routers/photo')
const FindProductRouter = require('./routers/FindProductRouter')
const Backup = require('./routers/BackupRouter');
const DemoRouter = require('./routers/DemoRouter');
const BannerRouter = require('./routers/BannerRouter')


app.use(AdminRoter)
app.use(ItemRouter)
app.use(SubItemRouter)
app.use(SubChildRouter)
app.use(SellerRouter)
app.use(ProductRouter)
app.use(UserRouter)
app.use(CartRouter)
app.use(WhishlistRouter)
app.use(AddressRouter)
app.use(OrderRouter)
app.use(PaymentRouter)
app.use(ForgetPasswordRouter)
app.use(Photo)
app.use(FindProductRouter)
app.use(Backup)
app.use(DemoRouter)
app.use(BannerRouter)

// const router = ({
//     AdminRoter,
//     ItemRouter,
//     SubItemRouter,
//     SubChildRouter,
//     SellerRouter,
//     ProductRouter,
//     UserRouter,
//     CartRouter,
//     WhishlistRouter,
//     AddressRouter,
//     OrderRouter,
//     PaymentRouter,
//     ForgetPasswordRouter,
//     Photo,
//     FindProductRouter,
//     Backup,
//     DemoRouter,
//     BannerRouter}
// )
// module.exports = router



