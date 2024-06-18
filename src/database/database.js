const mongoose = require('mongoose')
const chalk = require('chalk')

const database = 'ecommerce-demo'
const url = `mongodb://localhost:27021/${database}?retryWrites=true&w=majority`

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
