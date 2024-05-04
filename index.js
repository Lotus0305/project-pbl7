const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const swaggerUi = require('swagger-ui-express');
var bodyParser = require("body-parser");
const swaggerDocument = require('./config/swagger');
const authorRouter = require("./routes/authorRoute");
const categoryRouter = require("./routes/categoryRoute");
const comicRouter = require("./routes/comicRoute");
const authRouter = require("./routes/authRoute");
const accountRouter = require("./routes/accountRoute");


dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

mongoose.connect(
  'mongodb+srv://tienhungg0305:hYm142Jn4lXrC80r@cluster0.clbzefl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("common"));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/v1/author", authorRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/comic", comicRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/account", accountRouter);

app.get("/", (req, res) => res.send("Express on Vercel v2.0.0"));