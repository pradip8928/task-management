const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
dotenv.config();
app.use(express.json());
app.use(cookieParser());
require("./config/database.js");
app.use(cors());
const userRoutes = require("./routes/userRoutes.js")
const taskRoutes = require("./routes/taskRoutes.js")
const Port = process.env.PORT || 3000;



//User Routes
app.use("/user", userRoutes)
app.use("/task", taskRoutes);

app.listen(Port, () => {
    console.log(`port is running on ${Port}`);
});