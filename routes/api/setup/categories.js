const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://stringlab-ims-db-admin:uCETlFKjGyOQ6M4Y@cluster0.50yg5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const categoriesCollection = client.db('setup').collection('categories');

    try {
        await client.connect();

        // get all categories
        router.get('/', async (req, res) => {
            const query = {};
            const cursor = categoriesCollection.find(query);

            const categories = await cursor.toArray();

            if ((await cursor?.countDocuments) === 0) {
                res.status(400).send("No categories found");
            }
            else {
                res.status(200).send(categories)
            }
        });

        // get a categories by id
        router.get('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const category = await categoriesCollection.findOne(query);

            if (category) {
                res.status(200).json(category);
            } else {
                res.status(400).json({ message: `Categories with ${req.params.id} not found!` });
            }
        });

        // add new categories
        router.post('/', async (req, res) => {
            const newCategory = req?.body;
            const newCategoryItem = await categoriesCollection.insertOne(newCategory);

            res.send(newCategoryItem);
        });

        // delete a categories
        router.delete('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const deletedCategory = await categoriesCollection.deleteOne(query);

            res.send(deletedCategory);
        });

        // update a category data
        router.put('/:id', async (req, res) => {
            const id = req?.params?.id;
            const updateCategory = req?.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateCategoryData = {
                $set: {
                    name: updateCategory.name
                }
            };

            const updatedCategory = await categoriesCollection.updateOne(filter, updateCategoryData, options);

            res.send(updatedCategory);
        });

    } finally {
        // await client.close();
    };
}

run().catch(console.dir);

module.exports = router;