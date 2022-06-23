const express = require('express')
require('dotenv').config()
require('./database/database')
const AdminRoter = require('./routers/AdminRouter')
const ItemRouter = require('./routers/ItemRouter')
const SubItemRouter = require('./routers/SubItemRouter')
const SubChildRouter = require('./routers/SubChildRouter')


const app = express()
app.use(express.json())
const port = process.env.PORT

app.use(AdminRoter)
app.use(ItemRouter)
app.use(SubItemRouter)
app.use(SubChildRouter)



app.listen(port, () => {
    console.log(`server running on ${port}`);
})
