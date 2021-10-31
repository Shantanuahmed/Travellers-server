const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5001;
const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vgthc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('traveller');
        const travelPackages = database.collection('packages')
        const bookingPackage = database.collection('orders');

        // Get api
        app.get('/packages', async (req, res) => {
            const cursor = travelPackages.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });

        // Get single api by id
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const packages = await travelPackages.findOne(query);
            res.json(packages);
        });

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await bookingPackage.insertOne(order);
            res.json(result);
        })
        // Get order api
        app.get('/orders', async (req, res) => {
            const cursor = bookingPackage.find({});
            const order = await cursor.toArray();
            res.send(order);
        });

        // Delete order
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bookingPackage.deleteOne(query);
            res.json(result);
        })


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('serever running')
});

app.listen(port, () => {
    console.log('listening to port', port)
});