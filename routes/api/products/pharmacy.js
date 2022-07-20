const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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

        // get a pharmacy product by id
        router.get('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const pharmacyProduct = await pharmacyProductsCollection.findOne(query);

            if (pharmacyProduct) {
                res.status(200).json(pharmacyProduct);
            } else {
                res.status(400).json({ message: `Pharmacy product with ${req.params.id} not found!` });
            }
        });

        // add new pharmacy product
        router.post('/', async (req, res) => {
            const newPharmacyProduct = req?.body;
            const newProduct = await pharmacyProductsCollection.insertOne(newPharmacyProduct);

            res.send(newProduct);
        });

        // delete a pharmacy product
        app.delete('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const deletedPharmacyProduct = await pharmacyProductsCollection.deleteOne(query);

            res.send(deletedPharmacyProduct);
        });

        // update a pharmacy product data
        app.put('/:id', async (req, res) => {
            const id = req?.params?.id;
            const updatePharmacyProduct = req?.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatePharmacyProductData = {
                $set: {
                    name: updatePharmacyProduct.name
                }
            };

            const updatedProduct = await pharmacyProductsCollection.updateOne(filter, updatePharmacyProductData, options);

            res.send(updatedProduct);
        });

    } finally {
        // await client.close();
    };
}

run().catch(console.dir);

module.exports = router;