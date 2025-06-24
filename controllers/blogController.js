const Blog = require('../models/booktbl');
const fs = require('fs');

// Show all blogs
const showBlogs = (req, res) => {
    Blog.find({})
        .then(blogs => {
            res.render('index', {
                blogs: blogs,
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error fetching blogs');
        });
};

// Show add blog form
const showAddBlog = (req, res) => {
    res.render('form');
};

// Add new blog
const addBlog = (req, res) => {
    const { title, content, updateId } = req.body;

    if (updateId) {
        if (req.file) {
            Blog.findById(updateId).then((oldBlog) => {
                if (oldBlog && oldBlog.image) {
                    try {
                        fs.unlinkSync(oldBlog.image);
                    } catch (err) {
                        console.error('Error deleting old image:', err);
                    }
                }
                let image = req.file.path;
                Blog.findByIdAndUpdate(updateId, {
                    title,
                    content,
                    image
                }).then(() => {
                    console.log("Blog updated successfully");
                    return res.redirect('/blogs');
                }).catch(err => {
                    console.error(err);
                    res.status(500).send('Error updating blog');
                });
            }).catch(err => {
                console.error(err);
                res.status(500).send('Error finding blog');
            });
        } else {
            Blog.findByIdAndUpdate(updateId, {
                title,
                content
            }).then(() => {
                console.log("Blog updated successfully");
                return res.redirect('/blogs');
            }).catch(err => {
                console.error(err);
                res.status(500).send('Error updating blog');
            });
        }
    } else {
        if (!req.file) {
            return res.status(400).send('Image is required for new blogs');
        }
        Blog.create({
            title,
            content,
            image: req.file.path
        }).then(() => {
            console.log("Blog added successfully");
            return res.redirect('/blogs');
        }).catch(err => {
            console.error(err);
            res.status(500).send('Error adding blog');
        });
    }
};

// Show update blog form
const showUpdateBlog = (req, res) => {
    let updateId = req.query.updateId;
    if (!updateId) {
        return res.status(400).send('Update ID is required');
    }
    Blog.findById(updateId)
        .then((blog) => {
            if (!blog) {
                return res.status(404).send('Blog not found');
            }
            return res.render('update', { blog });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error fetching blog');
        });
};

// Delete blog
const deleteBlog = (req, res) => {
    let deleteId = req.params.id;
    if (!deleteId) {
        return res.status(400).send('Delete ID is required');
    }

    Blog.findById(deleteId)
        .then((blog) => {
            if (!blog) {
                return res.status(404).send('Blog not found');
            }
            if (blog.image) {
                try {
                    fs.unlinkSync(blog.image);
                } catch (err) {
                    console.error('Error deleting image:', err);
                }
            }
            return Blog.findByIdAndDelete(deleteId);
        })
        .then(() => {
            console.log("Blog deleted successfully");
            return res.redirect('/blogs');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error deleting blog');
        });
};

// Show single blog
const showSingleBlog = (req, res) => {
    Blog.findById(req.params.id)
        .then(blog => {
            if (!blog) {
                return res.status(404).send('Blog not found');
            }
            res.render('blog', { blog });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error fetching blog');
        });
};

module.exports = {
    showBlogs,
    showAddBlog,
    addBlog,
    showUpdateBlog,
    deleteBlog,
    showSingleBlog
}; 