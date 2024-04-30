const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken"); 
const verifyToken = require("./verifyToken"); 
const PORT = 6000;
const app = express();
const MONGO_URL = "mongodb+srv://tohitk121:9W3Sz9DS5vtAou6n@cluster0.dnwtdcw.mongodb.net/";

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }); 
const db = mongoose.connection;
db.on("error", (err) => {
  console.error("MongoDB connection error:", err); 
});
db.once("open", () => {
  console.log("MongoDB is connected");
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

const todoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  task: String,
  completed: {
    type: Boolean,
    default: false
  }
});
const Todo = mongoose.model("Todo", todoSchema);

app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcryptjs.hash(req.body.password, 10); 
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword, 
    });
    const savedUser = await newUser.save();

    const token = jwt.sign({ userId: savedUser._id }, "secret_key");
    res.status(201).json({ user: savedUser, token });
  } catch (error) {
    console.error("Error during registration:", error); 
    res.status(500).json({ error: "Internal server error" }); 
  }
});


app.get("/todos", verifyToken, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId });
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/todos", verifyToken, async (req, res) => {
  try {
    const newTodo = new Todo({
      userId: req.userId,
      task: req.body.task
    });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.put("/todos/:id", verifyToken, async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { task: req.body.task, completed: req.body.completed },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.delete("/todos/:id", verifyToken, async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});