const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: true
        },
        agent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        lead: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lead",
            required: true
        },
    },
    {
        timestamps: true
    }    
)

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;