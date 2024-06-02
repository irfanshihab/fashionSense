const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

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
    // const fashionsCollection = client
    //   .db("fashionSenseDB")
    //   .collection("clothes");
    const fashionsCollection = client
      .db("fashionSenseDB")
      .collection("clothesitem");
    const cartCollection = client.db("fashionSenseDB").collection("carts");

    app.get("/clothes", async (req, res) => {
      const result = await fashionsCollection.find().toArray();
      res.send(result);
    });

    app.get("/clothes/:id", async (req, res) => {
      try {
        const id = req.params.id;
        console.log(id);
        const query = { _id: id }; // Use string ID directly
        const result = await fashionsCollection.findOne(query);
        if (!result) {
          return res.status(404).send("Product not found");
        }
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
      }
    });

    // app.post("/cart", async (req, res) => {
    //   const item = req.body;
    //   try {
    //     const result = await cartCollection.insertOne(item);
    //     if (!result || !result.ops || result.ops.length === 0) {
    //       throw new Error("Failed to add item to cart");
    //     }
    //     res.status(201).send(result.ops[0]); // Sending back the inserted document
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).send("Internal server error");
    //   }
    // });
    app.get("/carts", async (req, res) => {
      const result = await cartCollection.find().toArray();
      res.send(result);
    });

    app.delete("/clothes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await fashionsCollection.deleteOne(query);
      res.send(result);
    });

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
    app.post("/carts", async (req, res) => {
      const item = req.body;
      console.log(item);
      try {
        // Check if the item already exists in the cart
        const existingItem = await cartCollection.findOne({
          clothesId: item.clothesId,
        });
        console.log(existingItem);
        if (existingItem) {
          return res
            .status(400)
            .send({ error: true, message: "Item already in cart" });
        }

        // If item doesn't exist, add it to the cart
        const result = await cartCollection.insertOne(item);
        res.status(201).send({ success: true, message: "Item added to cart" });
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
      }
    });
    app.get("/carts/:id", async (req, res) => {
      try {
        const id = req.params.id;
        console.log(id);
        const query = { _id: new ObjectId(id) }; // Use string ID directly
        const result = await cartCollection.findOne(query);
        if (!result) {
          return res.status(404).send("Product not found");
        }
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
      }
    });
    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

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
