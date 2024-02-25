const express = require("express");
const userRouter = require("./routes/user.router.js");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;
const connectDB = require("./config/db.js");
connectDB();
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
