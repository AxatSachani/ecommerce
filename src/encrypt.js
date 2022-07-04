const crypto = require('crypto')
const algorithm = "aes-256-cbc";
const secretKey = process.env.ENCRYPTION_SECRET_KEY
const iv = crypto.randomBytes(16)

// encrypt
const encrypt = (String) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
    let encryptedData = cipher.update(String, 'utf-8', 'hex')
    encryptedData += cipher.final('hex')
    return encryptedData
}

// decrypt
const decrypt = (hash) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv)
    let decryptedData = decipher.update(hesh, 'hex', 'utf-8')
    decryptedData += decipher.final('utf-8')
    return decryptedData
}

module.exports = {
    encrypt,
    decrypt
}

