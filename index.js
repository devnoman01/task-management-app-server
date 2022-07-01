const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rssh4.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log("DB Connected");

    const taskCollection = client.db("task_management_app").collection("tasks");

    app.get("/todotask", async (req, res) => {
      const tasks = await taskCollection.find().toArray();
      res.send(tasks);
    });

    //

    //
  } finally {
    //
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Task Management App Server Running");
});

app.listen(port, () => {
  console.log(`Task Management App Server Running on port ${port}`);
});
