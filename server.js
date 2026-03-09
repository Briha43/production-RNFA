const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const morgan = require("morgan"); //Logs every request in your terminal so you can see POST /register 201

// 1. Load environment variables FIRST
dotenv.config();

// 2. Connect to Database
connectDB();

const app = express();

// 3. Middlewares
app.use(cors());
app.use(express.json()); //able to send and rcv json data
app.use(morgan("dev"));

// Basic Route for testing
app.use("/api/v1/auth", require("./routes/userRoutes"));
app.use("/api/v1/post",require("./routes/postRoutes"));
//home page route
app.get("/",(req,res)=>{
  res.status(200).send({
    "success":true,
    "message":"node server running"
  })
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ success: false, message: "Internal Server Error" });
});

app.get("/test", (req, res) => {
  res.status(200).send("Server is alive!");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
