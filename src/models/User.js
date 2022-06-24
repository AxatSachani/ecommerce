const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({

    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    emailId: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email')
            }
        }
    },
    contact_no: {
        type: Number,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
    },
    alterContact_no: {
        type: Number
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (value.length < 6) {
                throw new Error('password must be contain atleast 6 characters')
            } else if (value.toLowerCase().includes('password')) {
                throw new Error(`Password can not contain ${value}`)
            } else if (value.endsWith(' ')) {
                throw new Error(`Password can not end with space (' ') `)
            }
        }
    }
})

UserSchema.methods.toJSON = function () {
    const user = this
    const userData = user.toObject()
    delete userData.password
    return userData
}

UserSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

UserSchema.statics.findByCredentials = async function (emailId, password) {
    const user = await User.findOne({emailId})
    if(!user){
        throw new Error('User not found')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Invalid Password')
    }
    return user
}

const User = mongoose.model('User', UserSchema)
module.exports = User