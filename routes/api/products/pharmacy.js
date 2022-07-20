const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://basic-databse-admin:HGYUGDbJKdhushnsudhs@cluster0.nvwif.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const pharmacyProductsCollection = client.db('dummy-data').collection('category');

    try {
        await client.connect();

        // get all pharmacy products
        router.get('/', async (req, res) => {
            const query = {};
            const cursor = pharmacyProductsCollection.find(query);

            const pharmacyProducts = await cursor.toArray();

            if ((await cursor?.countDocuments) === 0) {
                res.status(400).send("No pharmacy products found");
            }
            else {
                res.status(200).send(pharmacyProducts)
            }
        });
    } finally {
        // await client.close();
    };
}

run().catch(console.dir);

module.exports = router;