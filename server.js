// importing module and packages
const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors")



// importing routes
const allRoutes = require("./routes/index");

require("dotenv").config();



const app = express();
const PORT = process.env.PORT || 3000;

// setting up CORS
app.use(
  cors({
    origin: [
      process.env.FRONT_END_URL,
      "http://localhost:5173"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//  PREVENT OPTIONS FROM TOUCHING ANYTHING
app.options("*", cors());
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());






// datavse connecing 
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// setting up routes
app.use("/", allRoutes);
// starting server
// app.listen(PORT, () => {
//   console.log(`Server is running on PORT ${PORT}`);
// });


// for vercel 

module.exports = app;
