const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://stringlab-ims-db-admin:uCETlFKjGyOQ6M4Y@cluster0.50yg5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const employeesCollection = client.db('employees').collection('lists');

    try {
        await client.connect();

        // get all employees
        router.get('/', async (req, res) => {
            const query = {};
            const cursor = employeesCollection.find(query);

            const employees = await cursor.toArray();

            if ((await cursor?.countDocuments) === 0) {
                res.status(400).send("No employees found");
            }
            else {
                res.status(200).send(employees)
            }
        });

        // get a employees by id
        router.get('/:id', async (req, res) => {
            const id = req?.params?.id;
            if (id === undefined || 'undefined' || id === null) {
                res.status(400).json({ message: `Employee with ${req.params.id} not found!` });
            } else {
                const query = { _id: ObjectId(id) };
                const employees = await employeesCollection.findOne(query);

                if (employees) {
                    res.status(200).json(employees);
                } else {
                    res.status(400).json({ message: `Employee with ${req.params.id} not found!` });
                }
            }
        });

        // add new employee
        router.post('/', async (req, res) => {
            const newEmployees = req?.body;
            const newItems = await employeesCollection.insertOne(newEmployees);

            res.send(newItems);
        });

        // delete a employee
        router.delete('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const deletedEmployee = await employeesCollection.deleteOne(query);

            res.send(deletedEmployee);
        });

        // update a employee data
        router.put('/:id', async (req, res) => {
            const id = req?.params?.id;
            const updateEmployee = req?.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateEmployeeData = {
                $set: {
                    name: updateEmployee.name
                }
            };

            const updatedOrder = await employeesCollection.updateOne(filter, updateEmployeeData, options);

            res.send(updatedOrder);
        });

    } finally {
        // await client.close();
    };
}

run().catch(console.dir);

module.exports = router;