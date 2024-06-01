const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.String,
    content: {
      type: String,
      required: true,
      min: 1,
    },
    novel: {
      type: mongoose.Schema.Types.String,
      ref: "Novel",
      required: true,
      index: true
    },
    account: {
      type: mongoose.Schema.Types.String,
      ref: "Account",
      required: true,
      index: true
    },
    rating: {
      type: mongoose.Schema.Types.Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

commentSchema.post("save", async function () {
  const Novel = mongoose.model("Novel");
  const novel = await Novel.findById(this.novel);
  if (novel) {
    novel.totalRating += this.rating;
    novel.ratingCount += 1;
    novel.averageRating = novel.totalRating / novel.ratingCount;
    await novel.save();
  }
});

commentSchema.post("remove", async function () {
  const Novel = mongoose.model("Novel");
  const novel = await Novel.findById(this.novel);
  if (novel) {
    novel.totalRating -= this.rating;
    novel.ratingCount -= 1;
    novel.averageRating = novel.ratingCount > 0 ? novel.totalRating / novel.ratingCount : 0;
    await novel.save();
  }
});

module.exports = mongoose.model("Comment", commentSchema);
