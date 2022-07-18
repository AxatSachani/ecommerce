const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema({
    name: {
        type: String,
        default: 'done'
    },
    type: {
        type: String
    }
})

const i = function(name){
    const e = mongoose.model(`${name}`,Schema)
    return e
}
module.exports = {
    i
}