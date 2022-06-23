const mongoose = require('mongoose')
const database = 'ecommerce-clone'

mongoose.connect(`mongodb://127.0.0.1:27017/${database}`, {
    useNewUrlParser: true,
}, (err) => {
    if (err) {
        throw err.message
    }
    console.log(`'${database}' database connected`);
})