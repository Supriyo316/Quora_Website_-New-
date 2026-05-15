// middleware/auth.js
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in to do that!');
        return res.redirect('/login');
    }
    next();
};

const isAuthor = async (req, res, next) => {
    const Post = require('../models/Post');
    const { id } = req.params;
    
    try {
        const post = await Post.findById(id);
        
        if (!post) {
            req.flash('error', 'Post not found');
            return res.redirect('/posts');
        }
        
        if (!post.author.equals(req.user._id)) {
            req.flash('error', 'You do not have permission to do that!');
            return res.redirect(`/posts/${id}`);
        }
        
        next();
    } catch (error) {
        next(error);
    }
};

// Middleware to save returnTo URL
const saveReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

module.exports = { isLoggedIn, isAuthor, saveReturnTo };