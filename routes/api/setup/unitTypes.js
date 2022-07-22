const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://stringlab-ims-db-admin:uCETlFKjGyOQ6M4Y@cluster0.50yg5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const unitTypesCollection = client.db('setup').collection('unitTypes');

    try {
        await client.connect();

        // get all unit types
        router.get('/', async (req, res) => {
            const query = {};
            const cursor = unitTypesCollection.find(query);

            const unitTypes = await cursor.toArray();

            if ((await cursor?.countDocuments) === 0) {
                res.status(400).send("No unit types found");
            }
            else {
                res.status(200).send(unitTypes)
            }
        });

        // get a unit type by id
        router.get('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const unitType = await unitTypesCollection.findOne(query);

            if (unitType) {
                res.status(200).json(unitType);
            } else {
                res.status(400).json({ message: `Unit type with ${req.params.id} not found!` });
            }
        });

        // add new unitTypes
        router.post('/', async (req, res) => {
            const newUnitType = req?.body;
            const newUnitTypeItem = await unitTypesCollection.insertOne(newUnitType);

            res.send(newUnitTypeItem);
        });

        // delete a unit type
        router.delete('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const deletedUnitType = await unitTypesCollection.deleteOne(query);

            res.send(deletedUnitType);
        });

        // update a unit type data
        router.put('/:id', async (req, res) => {
            const id = req?.params?.id;
            const updateUnitType = req?.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateUnitTypeData = {
                $set: {
                    name: updateUnitType.name
                }
            };

            const updatedUnitType = await unitTypesCollection.updateOne(filter, updateUnitTypeData, options);

            res.send(updatedUnitType);
        });

    } finally {
        // await client.close();
    };
}

run().catch(console.dir);

module.exports = router;