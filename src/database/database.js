const mongoose = require('mongoose')


// const database = 'ecommerce'
// const url = `mongodb+srv://beact:Admin%40123@ecommerce.q6bo7w0.mongodb.net/${database}?retryWrites=true&w=majority`
//mongodb+srv://beact:Admin%40123@ecommerce.q6bo7w0.mongodb.net/ecommerce


const database = 'ecommerce-demo'
const url = `mongodb+srv://beact:Admin%40123@ecommerce-demo.xaafsoc.mongodb.net/${database}?retryWrites=true&w=majority`
//mongodb+srv://beact:Admin%40123@ecommerce-demo.xaafsoc.mongodb.net/ecommerce-demo


mongoose.connect(url, {
    useNewUrlParser: true,
}, (err) => {
    if (err) {
        throw err.message
    }
    console.log(`'${database}' database connected`);
})

module.exports={
    url:`${url}`
}