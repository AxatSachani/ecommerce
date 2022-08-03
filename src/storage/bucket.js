var admin = require("firebase-admin");
var serviceAccount = require("./ecommerce-3c496-firebase-adminsdk-fdltr-9be0b40173.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'ecommerce-3c496.appspot.com'
});
var bucket = admin.storage().bucket();


module.exports = bucket