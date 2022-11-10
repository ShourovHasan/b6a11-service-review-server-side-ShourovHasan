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

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        req.decoded = decoded;
        next();
    })
}

const run = async () => {
    try { 
        const servicesCollection = client.db('dentistryServices').collection('services');
        const reviewCollection = client.db('dentistryServices').collection('reviews');


        app.post('/jwt', (req, res) => {
            const user = req.body;
            // console.log(user);
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '365d' })
            res.send({ token });
        })

        // services 
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query).sort('_id', -1);
            const services = await cursor.toArray();
            res.send(services);
        });        
        app.get('/recentServices', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query).sort('_id', -1);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const services = await servicesCollection.findOne(query);
            res.send(services);
        });
        app.get('/serviceReviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const services = await servicesCollection.findOne(query);
            res.send(services);
        });
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.send(result);
        });

        // Reviews 
        app.get('/reviewsByEmail', verifyJWT, async (req, res) => {
            

            let query = {};
            if (req.query.reviewerEmail) {
                query = {
                    reviewerEmail: req.query.reviewerEmail
                }
            }
            const cursor = reviewCollection.find(query).sort('_id', -1);
            const reviews = await cursor.toArray();
            res.send(reviews);
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