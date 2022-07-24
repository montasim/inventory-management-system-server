const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://stringlab-ims-db-admin:uCETlFKjGyOQ6M4Y@cluster0.50yg5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const customersReturnsCollection = client.db('returns').collection('customers');

    try {
        await client.connect();

        // get all customers returns
        router.get('/', async (req, res) => {
            const query = {};
            const cursor = customersReturnsCollection.find(query);

            const customersReturns = await cursor.toArray();

            if ((await cursor?.countDocuments) === 0) {
                res.status(400).send("No customers returns found");
            }
            else {
                res.status(200).send(customersReturns)
            }
        });

        // get a customers returns by id
        router.get('/:id', async (req, res) => {
            const id = req?.params?.id;
            if (id === undefined || 'undefined' || id === null) {
                res.status(400).json({ message: `Employee with ${req.params.id} not found!` });
            } else {
                const query = { _id: ObjectId(id) };
                const customersReturns = await customersReturnsCollection.findOne(query);

                if (customersReturns) {
                    res.status(200).json(customersReturns);
                } else {
                    res.status(400).json({ message: `customersReturns with ${req.params.id} not found!` });
                }
            }
        });

        // add new customer return
        router.post('/', async (req, res) => {
            const newCustomerReturn = req?.body;
            const newItems = await customersReturnsCollection.insertOne(newCustomerReturn);

            res.send(newItems);
        });

        // delete a customer return
        router.delete('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const deletedCustomerReturn = await customersReturnsCollection.deleteOne(query);

            res.send(deletedCustomerReturn);
        });

        // update a customer return data
        router.put('/:id', async (req, res) => {
            const id = req?.params?.id;
            const updateCustomerReturn = req?.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateCustomerReturnData = {
                $set: {
                    name: updateCustomerReturn.name
                }
            };

            const updatedCustomerReturn = await customersReturnsCollection.updateOne(filter, updateCustomerReturnData, options);

            res.send(updatedCustomerReturn);
        });

    } finally {
        // await client.close();
    };
}

run().catch(console.dir);

module.exports = router;