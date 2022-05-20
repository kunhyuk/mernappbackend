require("dotenv").config();

const express = require('express')
const mongoose = require('mongoose')
const router = require('./Routes/userRoutes')

const { PORT = 3000, MONGODB_URL  } = process.env;
const cors = require("cors");
const morgan = require("morgan");
const app = express();


mongoose.connect(MONGODB_URL);
mongoose.connection
  .on("open", () => console.log("Your are connected to mongoose"))
  .on("close", () => console.log("Your are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json());

app.use("/api", router)

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));