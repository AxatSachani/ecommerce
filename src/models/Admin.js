
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const AdminSchema = new mongoose.Schema({

    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        trim: true
    },
    emailId: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email..')
            }
        },
        trim: true,
        lowercase: true,
        unique: true
    },
    contact_no: {
        type: Number,
        required: true,
        trim: true
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
    },
    tokens: [{
        token: {
            type: String
        }
    }]

})

// filter response data
AdminSchema.methods.toJSON = function () {
    const admin = this
    const adminData = admin.toObject()
    delete adminData.password
    delete adminData.tokens
    delete adminData.__v
    return adminData
}

// change password into bcrypt
AdminSchema.pre('save', async function (next) {
    const admin = this
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 12)
    }
    next()
})


// login data check
AdminSchema.statics.findByCredentials = async function (emailId, password) {
    const admin = await Admin.findOne({ emailId })
    if (!admin) {
        throw new Error('Admin not found')
    } else {
        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) {
            throw new Error('Wrong Password')
        }
        return admin
    }
}

// generate token
AdminSchema.methods.generateAuthToken = async function () {
    const admin = this
    const token = jwt.sign({ _id: admin._id.toString() }, 'token')
    admin.tokens = admin.tokens.concat({ token })
    await admin.save()
    return token
}

const Admin = mongoose.model('Admin', AdminSchema)
module.exports = Admin