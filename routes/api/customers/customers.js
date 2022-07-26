const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://stringlab-ims-db-admin:uCETlFKjGyOQ6M4Y@cluster0.50yg5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const customersCollection = client.db('customers').collection('lists');

    try {
        await client.connect();

        // get all customers
        router.get('/', async (req, res) => {
            const query = {};
            const cursor = customersCollection.find(query);

            const customers = await cursor.toArray();

            if ((await cursor?.countDocuments) === 0) {
                res.status(400).send("No customers found");
            }
            else {
                res.status(200).send(customers)
            }
        });

        // get a customers by id
        router.get('/:id', async (req, res) => {
            const id = req?.params?.id;
            if (id === undefined || 'undefined' || id === null) {
                res.status(400).json({ message: `Employee with ${req.params.id} not found!` });
            } else {
                const query = { _id: ObjectId(id) };
                const customers = await customersCollection.findOne(query);

                if (customers) {
                    res.status(200).json(customers);
                } else {
                    res.status(400).json({ message: `Customers with ${req.params.id} not found!` });
                }
            }
        });

        // add new customer
        router.post('/', async (req, res) => {
            const newCustomers = req?.body;
            const newItems = await customersCollection.insertOne(newCustomers);

            res.send(newItems);
        });

        // delete a customer
        router.delete('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const deletedCustomer = await customersCollection.deleteOne(query);

            res.send(deletedCustomer);
        });

        // update a customer data
        router.put('/:id', async (req, res) => {
            const id = req?.params?.id;
            const updateCustomer = req?.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateCustomerData = {
                $set: {
                    name: updateCustomer.name
                }
            };

            const updatedOrder = await customersCollection.updateOne(filter, updateCustomerData, options);

            res.send(updatedOrder);
        });

    } finally {
        // await client.close();
    };
}

run().catch(console.dir);

module.exports = router;