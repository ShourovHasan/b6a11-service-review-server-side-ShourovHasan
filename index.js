const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// middlewares 
app.use(cors());
app.use(express.json());

const userName = process.env.DB_USER;
const password = process.env.DB_PASSWORD;


// const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${userName}:${password}@cluster0.qwlqnnv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async () => {
    try { 
        const servicesCollection = client.db('dentistryServices').collection('services');
        const reviewCollection = client.db('dentistryServices').collection('reviews');

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        
    }
    finally {

    }
}
run().catch(error => console.error(error))


app.get('/', (req, res) => {
    res.send('Dentistry Services server is running')
})

app.listen(port, () => {
    console.log(`Dentistry Services server running on port ${port}`)
})