const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://stringlab-ims-db-admin:uCETlFKjGyOQ6M4Y@cluster0.50yg5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const documentsCollection = client.db('suppliers').collection('documents');

    try {
        await client.connect();

        // get all documents
        router.get('/', async (req, res) => {
            const query = {};
            const cursor = documentsCollection.find(query);

            const documents = await cursor.toArray();

            if ((await cursor?.countDocuments) === 0) {
                res.status(400).send("No documents found");
            }
            else {
                res.status(200).send(documents)
            }
        });

        // get a document by id
        router.get('/:id', async (req, res) => {
            const id = req?.params?.id;
            if (id === undefined || 'undefined' || id === null) {
                res.status(400).json({ message: `Document with ${req.params.id} not found!` });
            } else {
                const query = { _id: ObjectId(id) };
                const document = await documentsCollection.findOne(query);

                if (document) {
                    res.status(200).json(document);
                } else {
                    res.status(400).json({ message: `Document with ${req.params.id} not found!` });
                }
            }
        });

        // add new Document
        router.post('/', async (req, res) => {
            const newDocument = req?.body;
            const newItems = await documentsCollection.insertOne(newDocument);

            res.send(newItems);
        });

        // delete a Document
        router.delete('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const deletedDocument = await documentsCollection.deleteOne(query);

            res.send(deletedDocument);
        });

        // update a Document data
        router.put('/:id', async (req, res) => {
            const id = req?.params?.id;
            const updateDocument = req?.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDocumentData = {
                $set: {
                    name: updateDocument.name
                }
            };

            const updatedOrder = await documentsCollection.updateOne(filter, updateDocumentData, options);

            res.send(updatedOrder);
        });

    } finally {
        // await client.close();
    };
}

run().catch(console.dir);

module.exports = router;