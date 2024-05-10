const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");


const authorRouter = require("./routes/authorRoute");
const categoryRouter = require("./routes/categoryRoute");
const novelRouter = require("./routes/novelRoute");
const authRouter = require("./routes/authRoute");
const accountRouter = require("./routes/accountRoute");
const commentRouter = require("./routes/commentRoute");

const csvRouter = require("./routes/csvRouter");
var bodyParser = require("body-parser");

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

mongoose.connect(process.env.MONGODB_URL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("common"));

app.use("/api/v1/author", authorRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/novel", novelRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/account", accountRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/csv", csvRouter);
app.get("/", (req, res) => res.send("Express"));

const swaggerJsdoc = require('swagger-jsdoc');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'], // files containing annotations as above
};
const specs = swaggerJsdoc(options);
const swaggerUi = require('swagger-ui-express');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

