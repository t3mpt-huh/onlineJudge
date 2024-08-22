require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const authRoute = require("./router/auth-router");
const problemsRoute = require("./router/problem-router");
const submissionsRoute = require("./router/submissions-router");

const connectDb = require("./utils/db");
const errorMiddleware = require("./middlewares/error-middleware");

// Define CORS options
const corsOptions = {
  origin: [
    'https://lethimcode.pro',
    'https://www.lethimcode.pro',
    'http://localhost:5173',
    'http://localhost:4890',
    'https://online-judge-t3-ansh-bansals-projects-15f560f5.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

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