const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate('author', 'username avatar')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'username' }
                // In a real app we might paginate comments or limit them
            });

        // Transform for frontend
        const formattedPosts = posts.map(post => ({
            id: post._id,
            username: post.author ? post.author.username : 'Unknown', // Fallback
            userAvatar: post.author ? post.author.avatar : null,
            imageUrl: post.imageUrl,
            caption: post.caption,
            initialLikes: post.likesCount || 0,
            timestamp: new Date(post.createdAt).toLocaleDateString(),
            comments: post.comments.map(c => ({
                id: c._id,
                username: c.author ? c.author.username : 'Unknown',
                text: c.isFlagged ? '[Content Hidden by AI]' : c.text
            })),
            isLiked: false // Placeholder as we don't have auth context yet
        }));

        res.json(formattedPosts);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Create post
router.post('/', upload, async (req, res) => {
    try {
        // Mock User for now if not sent
        // In real app: req.user.id
        // We will create a default user if none exists for testing
        let user = await User.findOne({ username: 'testuser' });
        if (!user) {
            user = await new User({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password'
            }).save();
        }

        let imageUrl = '';

        console.log('File received:', req.file ? 'Yes' : 'No');
        if (req.file) console.log('File path:', req.file.path);

        if (req.file) {
            // Try Cloudinary Upload
            try {
                if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === '...') {
                    throw new Error("Cloudinary not configured");
                }
                const result = await cloudinary.uploader.upload(req.file.path);
                imageUrl = result.secure_url;
            } catch (pUploadError) {
                console.warn("Cloudinary upload failed/skipped. Using local file.", pUploadError.message);
                // Fallback: Use local server URL
                // Assuming server runs on PORT 5002 by default
                const PORT = process.env.PORT || 5002;
                imageUrl = `http://127.0.0.1:${PORT}/uploads/${req.file.filename}`;
            }
        } else {
            return res.status(400).json("Image required");
        }

        const newPost = new Post({
            caption: req.body.caption,
            imageUrl: imageUrl,
            author: user._id
        });

        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        console.error("Create Post Error:", err);
        res.status(500).json({ message: err.message || "Internal Server Error" });
    }
});

// Join User (Like)
router.put('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json("Post not found");

        // Mock functionality: just increment
        // In real app verify if user liked
        post.likesCount += 1;
        await post.save();

        res.status(200).json("The post has been liked");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
