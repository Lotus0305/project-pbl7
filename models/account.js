const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.String,
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
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: mongoose.Schema.Types.String,
      ref: "Role",
      required: true,
      index: true
    },
    likedNovels: [
      {
        type: mongoose.Schema.Types.String,
        ref: "Novel",
        index: true
      },
    ],
  },
  { timestamps: true },
  { strict: true }
);

accountSchema.pre("save", async function (next) {
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

module.exports = mongoose.model("Account", accountSchema);
