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

const corsOptions = {
  origin: [
    "http://localhost:5173",  
    "http://127.0.0.1:5173" ,
    process.env.FRONT_END_URL, 
  ],
  credentials: true,
};

// Apply CORS 
app.use(cors(corsOptions));




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());






// database connecting 
app.use(async (req, res, next) => {
  
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    await connectDB();
    next();
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ error: "Database connection failed" });
  }
});
// setting up routes
app.use("/", allRoutes);
// starting server
// app.listen(PORT, () => {
//   console.log(`Server is running on PORT ${PORT}`);
// });


// for vercel 

module.exports = app;
