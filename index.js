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
    // const completedTaskCollection = client
    //   .db("task_management_app")
    //   .collection("completed_tasks");

    app.get("/all-todo-task", async (req, res) => {
      const query = { status: "pending" };
      const tasks = await taskCollection.find(query).toArray();
      res.send(tasks);
    });

    app.get("/all-todo-task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const task = await taskCollection.findOne(query);
      res.send(task);
    });

    // post task
    app.post("/all-todo-task", async (req, res) => {
      const value = req.body;
      console.log(value);
      const result = await taskCollection.insertOne(value);
      res.send(result);
    });

    // app.get("/home-todo-task", async (req, res) => {
    //   const tasks = await taskCollection.find().toArray();
    //   res.send(tasks);
    // });

    app.delete("/all-todo-task/", async (req, res) => {
      const id = req.query.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });

    // app.delete("/todo-task-completed/", async (req, res) => {
    //   const id = req.query.id;
    //   console.log(id);
    //   const query = { _id: ObjectId(id) };
    //   const result = await taskCollection.deleteOne(query);
    //   res.send(result);
    // });

    // api for updaing task title
    app.patch("/all-todo-task/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };

      console.log(data);
      const key = Object.keys(data);
      if (key[0] == "newTitle") {
        const updatedTask = {
          $set: {
            title: data.newTitle,
          },
        };
        const updateTask = await taskCollection.updateOne(filter, updatedTask);
        res.send(updateTask);
      } else {
        const updatedTask = {
          $set: {
            status: data.status,
          },
        };
        const updateTask = await taskCollection.updateOne(filter, updatedTask);
        res.send(updateTask);
      }
    });

    app.get("/completed-task", async (req, res) => {
      const query = { status: "completed" };
      const tasks = await taskCollection.find(query).toArray();
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
