require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const { initializeDatabase } = require("./db");

const fs = require("fs");
const Fruit = require("./models/fruits.models", "utf-8");

app.use(express.json());
initializeDatabase();
//const jsonData = fs.readFileSync('fruits.json')
//const fruitsData = JSON.parse(jsonData)

// function seedData() {
//   try {
//     for (const fruitData of fruitsData) {
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

//get all fruits
app.get("/fruits", async (req, res) => {
  try {
    const allFruits = await Fruit.find();
    res.json(allFruits);
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
});

//add fruits
app.post("/fruits", async (req, res) => {
  const { name, color, rate, category } = req.body;

  try {
    const newFruit = new Fruit({ name, color, rate, category });
    await newFruit.save();
    res.status(201).json(newFruit);
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
});

//delete fruit
app.delete("/fruits/:id", async (req, res) => {
  const fruitId = req.params.id;

  try {
    const deleteFruit = await Fruit.findByIdAndDelete(fruitId);
    if (!deleteFruit) {
      return res.status(404).json({ error: "fruit not found" });
    }

    res
      .status(200)
      .json({ message: "fruit deleted successfully", fruit: deleteFruit });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

//get fruit by category
app.get("/fruits/category/:category", async (req, res) => {
  const { category } = req.params;
  console.log(category);

  try {
    const categoryFruit = await Fruit.find({ category: category });
    //const categoryFruit = await Fruit.find(req.params.category);
    if (categoryFruit.length != 0) {
      res.json(categoryFruit);
    } else {
      res.status(400).json({ error: "fruit not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to fetch" });
  }
});

//get fruit by name
app.get("/fruits/name/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const fruitByname = await Fruit.find({ name: name });
    if (fruitByname) {
      res.json(fruitByname);
    } else {
      res.status(400).json({ error: "fruit not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to fetch" });
  }
});

//UPDATE A FRUIT
app.put("/fruits/:id", async (req, res) => {
  const fruitId = req.params.id;
  const updatedFruit = req.body;

  try {
    const updateFruit = await Fruit.findByIdAndUpdate(fruitId, updatedFruit, {
      new: true,
    });
    if (!updatedFruit) {
      return res.status(404).json({ message: "Fruit not found" });
    }

    res.status(200).json(updateFruit);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
