const Comment = require("../models/Comment")

const createComment = async (req, res) => {
    try {
        const comment = await Comment.create(req.body);
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getComment = async (req, res) => {
    try {
        const comments = await Comment.find().populate("lead", "name")
        .populate("agent", "name")

        res.status(200).json(comments)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        if(!comment) {
            return res.status(404).json({
                message: "Comment not found"
            })
        }
        res.status(200).json(comment)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if(!comment) {
        return res.status(404).json({
            message: "Comment not found"
    })
}

res.status(200).json(comment)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {
    updateComment, getComment, createComment, deleteComment
}