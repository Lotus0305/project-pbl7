const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.String,
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
  { strict: true }
);

categorySchema.pre("save", async function (next) {
  if (this.isNew) {
    if (!this._id) {
      const timestamp = Date.now().toString();
      const randomNum = Math.floor(Math.random() * 10000).toString();
      const id = timestamp + randomNum;
      this._id = "0" + id.toString();
    }
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);
