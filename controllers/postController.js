// controllers/postController.js
const Post = require('../models/Post');

module.exports.index = async (req, res) => {
    const posts = await Post.find({})
        .populate('author', 'username')
        .sort({ createdAt: -1 });
    res.render('posts/index', { posts });
};

module.exports.renderNewForm = (req, res) => {
    res.render('posts/new');
};

module.exports.createPost = async (req, res) => {
    const post = new Post({
        content: req.body.content,
        author: req.user._id
    });
    
    await post.save();
    req.flash('success', 'Successfully created a new post!');
    res.redirect(`/posts/${post._id}`);
};

module.exports.showPost = async (req, res) => {
    const post = await Post.findById(req.params.id)
        .populate('author', 'username');
    
    if (!post) {
        req.flash('error', 'Cannot find that post!');
        return res.redirect('/posts');
    }
    
    res.render('posts/show', { post });
};

module.exports.renderEditForm = async (req, res) => {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
        req.flash('error', 'Cannot find that post!');
        return res.redirect('/posts');
    }
    
    res.render('posts/edit', { post });
};

module.exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(
        id,
        { content: req.body.content },
        { new: true, runValidators: true }
    );
    
    if (!post) {
        req.flash('error', 'Cannot find that post!');
        return res.redirect('/posts');
    }
    
    req.flash('success', 'Successfully updated post!');
    res.redirect(`/posts/${post._id}`);
};

module.exports.deletePost = async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    
    req.flash('success', 'Successfully deleted post');
    res.redirect('/posts');
};