const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://stringlab-ims-db-admin:uCETlFKjGyOQ6M4Y@cluster0.50yg5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const paymentsCollection = client.db('suppliers').collection('payments');

    try {
        await client.connect();

        // get all payments
        router.get('/', async (req, res) => {
            const query = {};
            const cursor = paymentsCollection.find(query);

            const payments = await cursor.toArray();

            if ((await cursor?.countDocuments) === 0) {
                res.status(400).send("No payments found");
            }
            else {
                res.status(200).send(payments)
            }
        });

        // get a payment by id
        router.get('/:id', async (req, res) => {
            const id = req?.params?.id;
            if (id === undefined || 'undefined' || id === null) {
                res.status(400).json({ message: `payment with ${req.params.id} not found!` });
            } else {
                const query = { _id: ObjectId(id) };
                const payment = await paymentsCollection.findOne(query);

                if (payment) {
                    res.status(200).json(payment);
                } else {
                    res.status(400).json({ message: `Payment with ${req.params.id} not found!` });
                }
            }
        });

        // add new payment
        router.post('/', async (req, res) => {
            const newPayment = req?.body;
            const newItems = await paymentsCollection.insertOne(newPayment);

            res.send(newItems);
        });

        // delete a payment
        router.delete('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const deletedPayment = await paymentsCollection.deleteOne(query);

            res.send(deletedPayment);
        });

        // update a payment data
        router.put('/:id', async (req, res) => {
            const id = req?.params?.id;
            const updatePayment = req?.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatePaymentData = {
                $set: {
                    name: updatePayment.name
                }
            };

            const updatedOrder = await paymentsCollection.updateOne(filter, updatePaymentData, options);

            res.send(updatedOrder);
        });

    } finally {
        // await client.close();
    };
}

run().catch(console.dir);

module.exports = router;