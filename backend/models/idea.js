const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const innerIdeaSchema = new Schema(
  {
    title: { type: String, required: true },
    details: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

const ideaSchema = new Schema(
  {
    versions: [{ type: innerIdeaSchema }],
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    tags: [{ type: String }],
    //private can be included in tags
      //could have special notation, like with ** in front of it or something
    creator: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

const Idea = mongoose.model("Idea", ideaSchema);

module.exports = { Idea };
