const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://stringlab-ims-db-admin:uCETlFKjGyOQ6M4Y@cluster0.50yg5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const pharmacyPurchasesCollection = client.db('purchases').collection('pharmacy');

    try {
        await client.connect();

        // get all non pharmacy Purchases
        router.get('/', async (req, res) => {
            const query = {};
            const cursor = pharmacyPurchasesCollection.find(query);

            const pharmacyPurchases = await cursor.toArray();

            if ((await cursor?.countDocuments) === 0) {
                res.status(400).send("No non pharmacy Purchases found");
            }
            else {
                res.status(200).send(pharmacyPurchases)
            }
        });

        // get a non pharmacy Purchases by id
        router.get('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const pharmacyPurchases = await pharmacyPurchasesCollection.findOne(query);

            if (pharmacyPurchases) {
                res.status(200).json(pharmacyPurchases);
            } else {
                res.status(400).json({ message: `Non Pharmacy Purchases with ${req.params.id} not found!` });
            }
        });

        // add new non pharmacy Purchase
        router.post('/', async (req, res) => {
            const newPharmacyPurchases = req?.body;
            const newItems = await pharmacyPurchasesCollection.insertOne(newPharmacyPurchases);

            res.send(newItems);
        });

        // delete a non pharmacy Purchase
        router.delete('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const deletedPharmacyPurchase = await pharmacyPurchasesCollection.deleteOne(query);

            res.send(deletedPharmacyPurchase);
        });

        // update a non pharmacy Purchase data
        router.put('/:id', async (req, res) => {
            const id = req?.params?.id;
            const updatePharmacyPurchase = req?.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatePharmacyPurchaseData = {
                $set: {
                    name: updatePharmacyPurchase.name
                }
            };

            const updatedPurchase = await pharmacyPurchasesCollection.updateOne(filter, updatePharmacyPurchaseData, options);

            res.send(updatedPurchase);
        });

    } finally {
        // await client.close();
    };
}

run().catch(console.dir);

module.exports = router;