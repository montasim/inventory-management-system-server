const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = "mongodb+srv://basic-databse-admin:HGYUGDbJKdhushnsudhs@cluster0.nvwif.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const nonPharmacyProductsCollection = client.db('dummy-data').collection('category');

    try {
        await client.connect();

        // get all non pharmacy products
        router.get('/', async (req, res) => {
            const query = {};
            const cursor = nonPharmacyProductsCollection.find(query);

            const nonPharmacyProducts = await cursor.toArray();

            if ((await cursor?.countDocuments) === 0) {
                res.status(400).send("No non pharmacy products found");
            }
            else {
                res.status(200).send(nonPharmacyProducts)
            }
        });

        // get a non pharmacy product by id
        router.get('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const nonPharmacyProduct = await nonPharmacyProductsCollection.findOne(query);

            if (nonPharmacyProduct) {
                res.status(200).json(nonPharmacyProduct);
            } else {
                res.status(400).json({ message: `Non Pharmacy product with ${req.params.id} not found!` });
            }
        });

        // add new non pharmacy product
        router.post('/', async (req, res) => {
            const newNonPharmacyProduct = req?.body;
            const newProduct = await nonPharmacyProductsCollection.insertOne(newNonPharmacyProduct);

            res.send(newProduct);
        });

        // delete a non pharmacy product
        router.delete('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const deletedNonPharmacyProduct = await nonPharmacyProductsCollection.deleteOne(query);

            res.send(deletedNonPharmacyProduct);
        });

        // update a non pharmacy product data
        router.put('/:id', async (req, res) => {
            const id = req?.params?.id;
            const updateNonPharmacyProduct = req?.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateNonPharmacyProductData = {
                $set: {
                    name: updateNonPharmacyProduct.name
                }
            };

            const updatedProduct = await nonPharmacyProductsCollection.updateOne(filter, updateNonPharmacyProductData, options);

            res.send(updatedProduct);
        });

    } finally {
        // await client.close();
    };
}

run().catch(console.dir);

module.exports = router;