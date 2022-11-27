const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('HMAS-Furniture server');
})

//MongoDb

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.iahawou.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const home_category = client.db("HMAS-Furniture").collection("Home-category");

        const users_collection = client.db("HMAS-Furniture").collection("users_collection");

        const sellers_collection = client.db("HMAS-Furniture").collection("sellers_collection");

        const usersBooking_collection = client.db("HMAS-Furniture").collection("usersBooking_collection");

        //home categories
        app.get('/categories', async (req, res) => {
            const query = {};
            const result = await home_category.find(query).toArray();
            res.send(result);
        })

        //get specific datas from categories
        app.get('/categories/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const categories = await home_category.findOne(query);
            res.send(categories);
        })

        //new create user api to save on database
        app.post('/users', async (req, res) => {
            const query = req.body;
            const user = await users_collection.insertOne(query);
            res.send(user);
        })

        //new create seller-user api to save on database
        app.post('/users', async (req, res) => {
            const query = req.body;
            const user = await users_collection.insertOne(query);
            res.send(user);
        })

        //user booking api
        app.post('/userBooking', async (req, res) => {
            const query = req.body;
            const userBooking = await usersBooking_collection.insertOne(query);
            res.send(userBooking);
        })
        //get jwt token api

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await users_collection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1hr' });
                return res.send({ accessToken: token });
            }
            res.status(403).send({ accessToken: '' });
        })
    }

    finally {

    }
}
run().catch(error => {
    console.log(error);
})



app.listen(port, () => {
    console.log(`HMAS-Furniture-server listening on port ${port}`)
})