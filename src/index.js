const express = require('express')
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


const app = express()
app.use(express.json())
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



app.listen(port, () => {
    console.log(`server running on ${port}`);
})
