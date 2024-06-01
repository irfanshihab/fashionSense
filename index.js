const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://fashionSense:FNkdfiQbjJMmquE1@cluster0.psezczp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// fashionSense
// FNkdfiQbjJMmquE1
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const fashionCollection = client.db("fashionSenseDB").collection("lists");

    app.get("/lists", async (req, res) => {
      const result = await fashionCollection.find().toArray();
      res.send(result);
    });
    // app.get("/services/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };

    //   const options = {
    //     // Include only the `title` and `imdb` fields in the returned document
    //     projection: { title: 1, price: 1, service_id: 1, img: 1 },
    //   };

    //   const result = await serviceCollection.findOne(query, options);
    //   res.send(result);
    // });
    // app.delete("/bookings/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await bookingCollection.deleteOne(query);
    //   res.send(result);
    // });

    // cart collection apis
    // app.get("/carts", verifyJWT, async (req, res) => {
    //   const email = req.query.email;

    //   if (!email) {
    //     res.send([]);
    //   }

    //   const decodedEmail = req.decoded.email;
    //   if (email !== decodedEmail) {
    //     return res
    //       .status(403)
    //       .send({ error: true, message: "forbidden access" });
    //   }

    //   const query = { email: email };
    //   const result = await cartCollection.find(query).toArray();
    //   res.send(result);
    // });

    // app.post("/carts", async (req, res) => {
    //   const item = req.body;
    //   const result = await cartCollection.insertOne(item);
    //   res.send(result);
    // });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
