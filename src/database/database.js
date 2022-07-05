const mongoose = require('mongoose')
const database = 'ecommerce'
const url = `mongodb+srv://beact:Admin%40123@ecommerce.q6bo7w0.mongodb.net/${database}?retryWrites=true&w=majority`

mongoose.connect(url, {
    useNewUrlParser: true,
}, (err) => {
    if (err) {
        throw err.message
    }
    console.log(`'${database}' database connected`);
})



// const  {MongoClient}  = require('mongodb');
// async function main() {
//     const uri = 'mongodb+srv://beact:Admin%40123@ecommerce.q6bo7w0.mongodb.net/?retryWrites=true&w=majority'

//     const client = new MongoClient(uri);
//     try {
//         await client.connect();

//         await listDatabases(client);

//     } catch (e) {
//         console.error(e);
//     } finally {
//         await client.close();
//     }
// }
// main().catch(console.error);

// async function listDatabases(client) {
//     databasesList = await client.db().admin().listDatabases();

//     console.log("Databases:");
//     databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };