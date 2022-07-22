const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://stringlab-ims-db-admin:uCETlFKjGyOQ6M4Y@cluster0.50yg5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const companiesCollection = client.db('setup').collection('companies');

    try {
        await client.connect();

        // get all companies
        router.get('/', async (req, res) => {
            const query = {};
            const cursor = companiesCollection.find(query);

            const companies = await cursor.toArray();

            if ((await cursor?.countDocuments) === 0) {
                res.status(400).send("No companies found");
            }
            else {
                res.status(200).send(companies)
            }
        });

        // get a companies by id
        router.get('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const company = await companiesCollection.findOne(query);

            if (company) {
                res.status(200).json(company);
            } else {
                res.status(400).json({ message: `companies with ${req.params.id} not found!` });
            }
        });

        // add new companies
        router.post('/', async (req, res) => {
            const newCompany = req?.body;
            const newCompanyItem = await companiesCollection.insertOne(newCompany);

            res.send(newCompanyItem);
        });

        // delete a companies
        router.delete('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const deletedCompany = await companiesCollection.deleteOne(query);

            res.send(deletedCompany);
        });

        // update a company data
        router.put('/:id', async (req, res) => {
            const id = req?.params?.id;
            const updateCompany = req?.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateCompanyData = {
                $set: {
                    name: updateCompany.name
                }
            };

            const updatedCompany = await companiesCollection.updateOne(filter, updateCompanyData, options);

            res.send(updatedCompany);
        });

    } finally {
        // await client.close();
    };
}

run().catch(console.dir);

module.exports = router;