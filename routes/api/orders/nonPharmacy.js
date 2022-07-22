const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://stringlab-ims-db-admin:uCETlFKjGyOQ6M4Y@cluster0.50yg5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const nonPharmacyOrdersCollection = client.db('orders').collection('nonPharmacy');

    try {
        await client.connect();

        // get all non pharmacy orders
        router.get('/', async (req, res) => {
            const query = {};
            const cursor = nonPharmacyOrdersCollection.find(query);

            const nonPharmacyOrders = await cursor.toArray();

            if ((await cursor?.countDocuments) === 0) {
                res.status(400).send("No non pharmacy orders found");
            }
            else {
                res.status(200).send(nonPharmacyOrders)
            }
        });

        // get a non pharmacy order by id
        router.get('/:id', async (req, res) => {
            const id = req?.params?.id;

            if (id === undefined || 'undefined' || id === null) {
                res.status(400).json({ message: `Employee with ${req.params.id} not found!` });
            } else {
                const query = { _id: ObjectId(id) };
                const nonPharmacyOrders = await nonPharmacyOrdersCollection.findOne(query);

                if (nonPharmacyOrders) {
                    res.status(200).json(nonPharmacyOrders);
                } else {
                    res.status(400).json({ message: `Non Pharmacy orders with ${req.params.id} not found!` });
                }
            }
        });

        // add new non pharmacy order
        router.post('/', async (req, res) => {
            const newNonPharmacyOrders = req?.body;
            const newItems = await nonPharmacyOrdersCollection.insertOne(newNonPharmacyOrders);

            res.send(newItems);
        });

        // delete a non pharmacy order
        router.delete('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const deletedNonPharmacyOrder = await nonPharmacyOrdersCollection.deleteOne(query);

            res.send(deletedNonPharmacyOrder);
        });

        // update a non pharmacy order data
        router.put('/:id', async (req, res) => {
            const id = req?.params?.id;
            const updateNonPharmacyOrder = req?.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateNonPharmacyOrderData = {
                $set: {
                    name: updateNonPharmacyOrder.name
                }
            };

            const updatedOrder = await nonPharmacyOrdersCollection.updateOne(filter, updateNonPharmacyOrderData, options);

            res.send(updatedOrder);
        });

    } finally {
        // await client.close();
    };
}

run().catch(console.dir);

module.exports = router;