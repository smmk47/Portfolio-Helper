// routes/BlogRoutes.js
const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// Get all blogs for a specific user
router.get('/:email', async (req, res) => {
  try {
    const blogs = await Blog.find({ email: req.params.email }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new blog
router.post('/', async (req, res) => {
  const { title, content, categories, tags, visibility, email } = req.body;

  const newBlog = new Blog({ title, content, categories, tags, visibility, email });
  try {
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a blog's content
router.put('/:id', async (req, res) => {
  const { content, title, categories, tags, visibility } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    if (content !== undefined) blog.content = content;
    if (title !== undefined) blog.title = title;
    if (categories !== undefined) blog.categories = categories;
    if (tags !== undefined) blog.tags = tags;
    if (visibility !== undefined) blog.visibility = visibility;

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a blog
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.status(200).json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
