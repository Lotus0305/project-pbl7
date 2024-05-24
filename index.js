// C:\Users\Tienh\Desktop\Code\PBL 7\recommender_system\sourceBE\index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const authorRouter = require("./routes/authorRoute");
const categoryRouter = require("./routes/categoryRoute");
const novelRouter = require("./routes/novelRoute");
const authRouter = require("./routes/authRoute");
const accountRouter = require("./routes/accountRoute");
const commentRouter = require("./routes/commentRoute");
const importRouter = require("./routes/importRoute");
const historyRouter = require("./routes/historyRoute");
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

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("common"));

app.use("/api/v1/author", authorRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/novel", novelRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/account", accountRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/import", importRouter);
app.use("/api/v1/history", historyRouter);

app.get("/", (req, res) => res.send("Express"));

// Kiểm tra sự tồn tại của file swagger_output.json
const swaggerFilePath = path.resolve(__dirname, './config/swagger_output.json');
if (fs.existsSync(swaggerFilePath)) {
  const swaggerFile = require(swaggerFilePath);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
  console.log("Swagger documentation is available at /api-docs");
} else {
  console.log("Swagger file not found. Please run `npm run swagger-autogen` first.");
}

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
