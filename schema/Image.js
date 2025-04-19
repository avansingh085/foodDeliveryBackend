
const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
    name: String,
    description: String,
    imageUrl: String,
  });
  const Image = mongoose.model("Image", imageSchema);