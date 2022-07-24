const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://stringlab-ims-db-admin:uCETlFKjGyOQ6M4Y@cluster0.50yg5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const listsCollection = client.db('suppliers').collection('lists');

    try {
        await client.connect();

        // get all lists
        router.get('/', async (req, res) => {
            const query = {};
            const cursor = listsCollection.find(query);

            const lists = await cursor.toArray();

            if ((await cursor?.countDocuments) === 0) {
                res.status(400).send("No lists found");
            }
            else {
                res.status(200).send(lists)
            }
        });

        // get a list by id
        router.get('/:id', async (req, res) => {
            const id = req?.params?.id;
            if (id === undefined || 'undefined' || id === null) {
                res.status(400).json({ message: `list with ${req.params.id} not found!` });
            } else {
                const query = { _id: ObjectId(id) };
                const list = await listsCollection.findOne(query);

                if (list) {
                    res.status(200).json(list);
                } else {
                    res.status(400).json({ message: `List with ${req.params.id} not found!` });
                }
            }
        });

        // add new list
        router.post('/', async (req, res) => {
            const newList = req?.body;
            const newItems = await listsCollection.insertOne(newList);

            res.send(newItems);
        });

        // delete a list
        router.delete('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const deletedList = await listsCollection.deleteOne(query);

            res.send(deletedList);
        });

        // update a list data
        router.put('/:id', async (req, res) => {
            const id = req?.params?.id;
            const updateList = req?.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateListData = {
                $set: {
                    name: updateList.name
                }
            };

            const updatedOrder = await listsCollection.updateOne(filter, updateListData, options);

            res.send(updatedOrder);
        });

    } finally {
        // await client.close();
    };
}

run().catch(console.dir);

module.exports = router;