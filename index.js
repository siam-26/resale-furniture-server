const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        //home categories
        app.get('/categories', async (req, res) => {
            const query = {};
            const result = await home_category.find(query).toArray();
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