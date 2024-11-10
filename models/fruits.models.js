const mongoose = require("mongoose");

const fruitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    color: String,
    rate: String,
    photo: String,
    category: [
      {
        type: String,
        enum: ["sweet", "sour", "bitter"],
      },
    ],
  },
  { timestamps: true }
);

const Fruit = mongoose.model("Fruit", fruitSchema);

module.exports = Fruit;
