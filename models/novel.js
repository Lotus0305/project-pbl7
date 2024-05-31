const mongoose = require("mongoose");

const novelSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.String,
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    chapters: {
      type: Number,
    },
    views: {
      type: Number,
    },
    rating: {
      type: Number,
    },
    powerStone: {
      type: Number,
    },
    imageUrl: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.String,
      ref: "Author",
    },
    category: {
      type: mongoose.Schema.Types.String,
      ref: "Category",
    },
  },
  { timestamps: true },
  { strict: true }
);

novelSchema.pre("save", async function (next) {
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

novelSchema.methods.updateRating = async function () {
  const Comment = mongoose.model("Comment");
  const result = await Comment.aggregate([
    { $match: { novel: this._id } },
    { $group: { _id: null, avgRating: { $avg: "$rating" } } }
  ]);

  if (result.length > 0) {
    this.rating = result[0].avgRating;
    await this.save();
  }
};

module.exports = mongoose.model("Novel", novelSchema);
