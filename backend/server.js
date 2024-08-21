require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const authRoute = require("./router/auth-router");
const problemsRoute = require("./router/problem-router");
const submissionsRoute = require("./router/submissions-router");

const connectDb = require("./utils/db");
const errorMiddleware = require("./middlewares/error-middleware");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Home page without api");
});

// Mount the Router
app.use("/api/auth", authRoute);
app.use("/api/problems", problemsRoute);
app.use("/api/submissions", submissionsRoute);

app.use(errorMiddleware);

const port = process.env.PORT || 5000;
connectDb().then(() => {
  app.listen(port, () => {
    console.log(`server is running at port: ${port}`);
  });
});