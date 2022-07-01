const express = require('express')
const fileUpload = require('express-fileupload');
require('dotenv').config()
require('./database/database')
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
const Photo = require('./routers/Photo')
const FindProductRouter = require('./routers/FindProductRouter')

const app = express()
app.use(express.json())
app.use(fileUpload());
const port = process.env.PORT

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




app.listen(port, () => {
    console.log(`server running on ${port}`);
})
