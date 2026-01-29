// importing module and packages
const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./config/db");
const CORS = require("cors")

// connecting to database
connectDB();

// importing routes
const allRoutes = require("./routes/index");

require("dotenv").config();



const app = express();
const PORT = process.env.PORT || 3000;

// setting up CORS
app.use(CORS({
  origin : [
   process.env.FRONT_END_URL,
    
    "localhost:5173"
  ],
  credentials : true,
   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// setting up routes

app.use("/", allRoutes);

// starting server
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

