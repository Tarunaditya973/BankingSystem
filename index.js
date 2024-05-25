const express = require("express");
const businessRoutes = require("./routes/business.routes");
require("dotenv").config();
const app = express();
import dbConnection from "./DB/dbConnection";
dbConnection();

app.use("/api/business", businessRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
