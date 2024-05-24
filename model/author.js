const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.Number,
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
  { strict: true }
);

authorSchema.pre("save", async function (next) {
  if (this.isNew) {
    if (!this._id) {
      const lastFind = await this.constructor.findOne().sort("-_id");
      const id = lastFind ? lastFind._id : 0;
      this._id = id + Date.now() + Math.floor(Math.random() * 10000);
    }
  }
  next();
});

module.exports = mongoose.model("Author", authorSchema);
