const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const uploadRoute = require("./routes/upload");
const apiRoute = require("./routes/api"); // Ensure this line is added

dotenv.config();
const app = express();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(express.json()); // Ensure you have this to parse JSON requests
app.use("/upload", uploadRoute);
app.use("/api", apiRoute); // Ensure this line is added

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
