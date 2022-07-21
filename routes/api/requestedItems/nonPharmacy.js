const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = "mongodb+srv://basic-databse-admin:HGYUGDbJKdhushnsudhs@cluster0.nvwif.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const nonPharmacyRequestedItemsCollection = client.db('dummy-data').collection('category');

    try {
        await client.connect();

        // get all non pharmacy requested items
        router.get('/', async (req, res) => {
            const query = {};
            const cursor = nonPharmacyRequestedItemsCollection.find(query);

            const nonPharmacyRequestedItems = await cursor.toArray();

            if ((await cursor?.countDocuments) === 0) {
                res.status(400).send("No non pharmacy requested items found");
            }
            else {
                res.status(200).send(nonPharmacyRequestedItems)
            }
        });

        // get a non pharmacy requested items by id
        router.get('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const nonPharmacyRequestedItems = await nonPharmacyRequestedItemsCollection.findOne(query);

            if (nonPharmacyRequestedItems) {
                res.status(200).json(nonPharmacyRequestedItems);
            } else {
                res.status(400).json({ message: `Non Pharmacy requested items with ${req.params.id} not found!` });
            }
        });

        // add new non pharmacy requested items
        router.post('/', async (req, res) => {
            const newNonPharmacyRequestedItems = req?.body;
            const newItems = await nonPharmacyRequestedItemsCollection.insertOne(newNonPharmacyRequestedItems);

            res.send(newItems);
        });

        // delete a non pharmacy requested items
        router.delete('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const deletedNonPharmacyRequestedItem = await nonPharmacyRequestedItemsCollection.deleteOne(query);

            res.send(deletedNonPharmacyRequestedItem);
        });

        // update a non pharmacy requested item data
        router.put('/:id', async (req, res) => {
            const id = req?.params?.id;
            const updateNonPharmacyRequestedItem = req?.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateNonPharmacyRequestedItemData = {
                $set: {
                    name: updateNonPharmacyRequestedItem.name
                }
            };

            const updatedRequestedItem = await nonPharmacyRequestedItemsCollection.updateOne(filter, updateNonPharmacyRequestedItemData, options);

            res.send(updatedRequestedItem);
        });

    } finally {
        // await client.close();
    };
}

run().catch(console.dir);

module.exports = router;