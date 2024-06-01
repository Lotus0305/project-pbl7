const mongoose = require("mongoose");
const Novel = require("./novel");

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
    },
    account: {
      type: mongoose.Schema.Types.String,
      ref: "Account",
      required: true,
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

const updateAverageRating = async (novelId) => {
  try {
    const comments = await mongoose.model("Comment").find({ novel: novelId });
    if (comments.length === 0) return 0;
    const totalRating = comments.reduce((acc, comment) => acc + comment.rating, 0);
    const averageRating = totalRating / comments.length;
    await Novel.findByIdAndUpdate(novelId, { averageRating });
    return averageRating;
  } catch (error) {
    throw error;
  }
};

commentSchema.post("save", async function () {
  await updateAverageRating(this.novel);
});

commentSchema.post("remove", async function () {
  await updateAverageRating(this.novel);
});

module.exports = mongoose.model("Comment", commentSchema);
