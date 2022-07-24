const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://stringlab-ims-db-admin:uCETlFKjGyOQ6M4Y@cluster0.50yg5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const expiresOrDamagesReturnsCollection = client.db('returns').collection('expiresOrDamagesReturns');

    try {
        await client.connect();

        // get all expires or damages returns
        router.get('/', async (req, res) => {
            const query = {};
            const cursor = expiresOrDamagesReturnsCollection.find(query);

            const expiresOrDamagesReturns = await cursor.toArray();

            if ((await cursor?.countDocuments) === 0) {
                res.status(400).send("No expires or damages returns found");
            }
            else {
                res.status(200).send(expiresOrDamagesReturns)
            }
        });

        // get a expires or damages returns by id
        router.get('/:id', async (req, res) => {
            const id = req?.params?.id;
            if (id === undefined || 'undefined' || id === null) {
                res.status(400).json({ message: `Employee with ${req.params.id} not found!` });
            } else {
                const query = { _id: ObjectId(id) };
                const expiresOrDamagesReturns = await expiresOrDamagesReturnsCollection.findOne(query);

                if (expiresOrDamagesReturns) {
                    res.status(200).json(expiresOrDamagesReturns);
                } else {
                    res.status(400).json({ message: `Expires or damages returns with ${req.params.id} not found!` });
                }
            }
        });

        // add new expire or damage return
        router.post('/', async (req, res) => {
            const newExpireOrDamageReturn = req?.body;
            const newItems = await expiresOrDamagesReturnsCollection.insertOne(newExpireOrDamageReturn);

            res.send(newItems);
        });

        // delete a expire or damage return
        router.delete('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const deletedExpireOrDamageReturn = await expiresOrDamagesReturnsCollection.deleteOne(query);

            res.send(deletedExpireOrDamageReturn);
        });

        // update a customer return data
        router.put('/:id', async (req, res) => {
            const id = req?.params?.id;
            const updateExpireOrDamageReturn = req?.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateExpireOrDamageReturnData = {
                $set: {
                    name: updateExpireOrDamageReturn.name
                }
            };

            const updatedExpireOrDamageReturn = await expiresOrDamagesReturnsCollection.updateOne(filter, updateExpireOrDamageReturnData, options);

            res.send(updatedExpireOrDamageReturn);
        });

    } finally {
        // await client.close();
    };
}

run().catch(console.dir);

module.exports = router;