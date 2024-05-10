const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.Number,
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: mongoose.Schema.Types.Number,
      ref: "Role",
      required: true,
    },
  },
  { timestamps: true },
  { strict: true }
);

accountSchema.pre("save", async function (next) {
  if (this.isNew) {
    if (!this._id) {
      const lastFind = await this.constructor.findOne().sort("-_id");
      const id = lastFind ? lastFind._id : 0;
      this._id = id + Date.now() + Math.floor(Math.random() * 10000);
    }
  }
  next();
});

module.exports = mongoose.model("Account", accountSchema);
