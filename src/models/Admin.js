
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')


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
    phone_no: {
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
    }

})

AdminSchema.methods.toJSON = function () {
    const admin = this
    const adminData = admin.toObject()
    delete adminData.password
    return adminData
}

AdminSchema.pre('save', async function (next) {
    const admin = this
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 12)
    }
    next()
})

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

const Admin = new mongoose.model('Admin', AdminSchema)
module.exports = Admin