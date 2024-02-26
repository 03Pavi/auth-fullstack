const express = require("express");
const userRouter = require("./routes/user.router.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8081;
const connectDB = require("./config/db.js");
connectDB();
app.use(cors({
  origin:"http://localhost:5173",
  methods:["POST", "GET"],
  credentials:true,
}));
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "server is running",
  });
});
app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log("server is listening!");
});
