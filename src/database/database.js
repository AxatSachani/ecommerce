const mongoose = require('mongoose')
const chalk = require('chalk')


// const database = 'ecommerce'
// const url = `mongodb+srv://beact:Admin%40123@ecommerce.q6bo7w0.mongodb.net/${database}?retryWrites=true&w=majority`
//mongodb+srv://beact:Admin%40123@ecommerce.q6bo7w0.mongodb.net/ecommerce


const database = 'ecommerce-demo'
const url = `mongodb+srv://beact:Admin%40123@ecommerce-demo.xaafsoc.mongodb.net/${database}?retryWrites=true&w=majority`
//mongodb+srv://beact:Admin%40123@ecommerce-demo.xaafsoc.mongodb.net/ecommerce-demo

var connectd = false
mongoose.connect(url, {
    useNewUrlParser: true,
}, (err) => {
    if (err) {
        throw err.message
    }
    console.log(chalk.blueBright(`${database}`),`database connected`);
    connectd = true

})

setTimeout(() => {
    if (connectd == false) {
        console.log(chalk.bgRed('ERROR:'), chalk.yellow(`${database} not connected \n\tmessage: time out`));
    }
}, 5000);
