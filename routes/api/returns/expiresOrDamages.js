const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = "mongodb+srv://basic-databse-admin:HGYUGDbJKdhushnsudhs@cluster0.nvwif.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const expiresOrDamagesCollection = client.db('dummy-data').collection('category');

    try {
        await client.connect();

        // get all expires or damages
        router.get('/', async (req, res) => {
            const query = {};
            const cursor = expiresOrDamagesCollection.find(query);

            const expiresOrDamages = await cursor.toArray();

            if ((await cursor?.countDocuments) === 0) {
                res.status(400).send("No expires or damages found");
            }
            else {
                res.status(200).send(expiresOrDamages)
            }
        });

        // get a expires or damages by id
        router.get('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const expiresOrDamages = await expiresOrDamagesCollection.findOne(query);

            if (expiresOrDamages) {
                res.status(200).json(expiresOrDamages);
            } else {
                res.status(400).json({ message: `expires or damages with ${req.params.id} not found!` });
            }
        });

        // add new expires or damages
        router.post('/', async (req, res) => {
            const newExpiresOrDamages = req?.body;
            const newItems = await expiresOrDamagesCollection.insertOne(newExpiresOrDamages);

            res.send(newItems);
        });

        // delete a expires or damages
        router.delete('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const deletedExpiresOrDamage = await expiresOrDamagesCollection.deleteOne(query);

            res.send(deletedExpiresOrDamage);
        });

        // update a expires or damages data
        router.put('/:id', async (req, res) => {
            const id = req?.params?.id;
            const updateExpiresOrDamage = req?.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateExpiresOrDamageData = {
                $set: {
                    name: updateExpiresOrDamage.name
                }
            };

            const updatedOrder = await expiresOrDamagesCollection.updateOne(filter, updateExpiresOrDamageData, options);

            res.send(updatedOrder);
        });

    } finally {
        // await client.close();
    };
}

run().catch(console.dir);

module.exports = router;