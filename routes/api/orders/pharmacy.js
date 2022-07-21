const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = "mongodb+srv://basic-databse-admin:HGYUGDbJKdhushnsudhs@cluster0.nvwif.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const pharmacyOrdersCollection = client.db('dummy-data').collection('category');

    try {
        await client.connect();

        // get all non pharmacy orders
        router.get('/', async (req, res) => {
            const query = {};
            const cursor = pharmacyOrdersCollection.find(query);

            const pharmacyOrders = await cursor.toArray();

            if ((await cursor?.countDocuments) === 0) {
                res.status(400).send("No non pharmacy orders found");
            }
            else {
                res.status(200).send(pharmacyOrders)
            }
        });

        // get a non pharmacy orders by id
        router.get('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const pharmacyOrders = await pharmacyOrdersCollection.findOne(query);

            if (pharmacyOrders) {
                res.status(200).json(pharmacyOrders);
            } else {
                res.status(400).json({ message: `Non Pharmacy orders with ${req.params.id} not found!` });
            }
        });

        // add new non pharmacy order
        router.post('/', async (req, res) => {
            const newPharmacyOrders = req?.body;
            const newItems = await pharmacyOrdersCollection.insertOne(newPharmacyOrders);

            res.send(newItems);
        });

        // delete a non pharmacy order
        router.delete('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const deletedPharmacyOrder = await pharmacyOrdersCollection.deleteOne(query);

            res.send(deletedPharmacyOrder);
        });

        // update a non pharmacy order data
        router.put('/:id', async (req, res) => {
            const id = req?.params?.id;
            const updatePharmacyOrder = req?.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatePharmacyOrderData = {
                $set: {
                    name: updatePharmacyOrder.name
                }
            };

            const updatedOrder = await pharmacyOrdersCollection.updateOne(filter, updatePharmacyOrderData, options);

            res.send(updatedOrder);
        });

    } finally {
        // await client.close();
    };
}

run().catch(console.dir);

module.exports = router;