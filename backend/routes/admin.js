const router = require('express').Router();
const Comment = require('../models/Comment');

// Get Flagged Comments
router.get('/flagged', async (req, res) => {
    try {
        const flaggedComments = await Comment.find({ isFlagged: true })
            .populate('author', 'username')
            .populate('post', 'imageUrl')
            .sort({ createdAt: -1 });

        res.json(flaggedComments);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete Comment
router.delete('/comments/:id', async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json("Comment deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

// Approve Comment (Unflag)
router.put('/comments/:id/approve', async (req, res) => {
    try {
        await Comment.findByIdAndUpdate(req.params.id, {
            isFlagged: false,
            moderationReason: null
        });
        res.status(200).json("Comment approved");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
