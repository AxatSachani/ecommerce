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

const router = {
    AdminRoter,
    ItemRouter,
    SubItemRouter,
    SubChildRouter,
    SellerRouter,
    ProductRouter,
    UserRouter,
    CartRouter,
    WhishlistRouter,
    AddressRouter,
    OrderRouter,
    PaymentRouter,
    ForgetPasswordRouter,
    Photo,
    FindProductRouter,
    Backup
}
module.exports=router


