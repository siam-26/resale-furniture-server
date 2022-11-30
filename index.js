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

        //MONGODB COLLECTIONS
        const home_category = client.db("HMAS-Furniture").collection("Home-category");

        const users_collection = client.db("HMAS-Furniture").collection("users_collection");

        const addProduct_collection = client.db("HMAS-Furniture").collection("addProduct_collection");

        // const sellers_collection = client.db("HMAS-Furniture").collection("sellers_collection");

        const usersBooking_collection = client.db("HMAS-Furniture").collection("usersBooking_collection");

        const advertise_collection = client.db("HMAS-Furniture").collection("advertise_collection");

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

        //get sellerUser's api from database
        app.get('/users/sellers/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await users_collection.findOne(query);
            res.send({ isSeller: user?.role === 'seller' });
        })

        //get admin's api from database
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await users_collection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })

        //get user's api from database
        app.get('/users/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await users_collection.findOne(query);
            res.send({ isUser: (!user?.role) });
        })

        //add product
        app.post('/addProducts', async (req, res) => {
            const seller = req.body;
            const result = await addProduct_collection.insertOne(seller);
            res.send(result);
        })

        //save advertised products
        app.post('/myProducts/advertise', async (req, res) => {
            const body = req.body;
            const result = await advertise_collection.insertOne(body);
            res.send(result);
        })

        //get advertised products
        app.get('/myProducts/advertise', async (req, res) => {
            const query = {};
            const result = await advertise_collection.find(query).toArray();
            res.send(result);
        })

        //get MyProducts
        app.get('/dashboard/myProducts', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const myProducts = await addProduct_collection.find(query).toArray();
            res.send(myProducts);
        })

        //delete api for myProducts
        app.delete('/dashboard/myProducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await addProduct_collection.deleteOne(query);
            res.send(result);
        })

        //delete api for a buyer
        app.delete('/dashboard/admin/allBuyers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await users_collection.deleteOne(query);
            res.send(result);
        })

        //delete api for a seller
        app.delete('/dashboard/admin/allSellers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await users_collection.deleteOne(query);
            res.send(result);
        })

        //Admin AllBuyers apiData
        app.get('/dashboard/admin/allBuyers', async (req, res) => {
            const query = {};
            const buyers = await users_collection.find(query).toArray();
            const result = buyers.filter(buyer => (!buyer?.role));
            res.send(result);
        })

        //Admin AllSellers apiData
        app.get('/dashboard/admin/allSellers', async (req, res) => {
            const query = {};
            const sellers = await users_collection.find(query).toArray();
            const result = sellers.filter(seller => (seller?.role === 'seller'));
            res.send(result);
        })

        //Admin seller verified status update
        app.put('/dashboard/admin/allSellers/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: 'verified'
                }
            }
            const result = await users_collection.updateOne(filter, updateDoc, options);
            res.send(result);
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