
// server.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data', 'blogs.json');

app.use(express.json());
app.use(cors({
    origin: 'https://pdflyer.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));

// Helper function to read blogs
const readBlogs = () => {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
};

// Helper function to write blogs
const writeBlogs = (blogs) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(blogs, null, 2));
};

// GET all blogs
app.get('/api/blogs', (req, res) => {
    const blogs = readBlogs();
    res.json(blogs || []);
});

// GET a single blog by ID
app.get('/api/blogs/:id', (req, res) => {
    const blogs = readBlogs();
    const blog = blogs.find(b => b.id === req.params.id);
    if (blog) {
        res.json(blog || {});
    } else {
        res.status(404).json({ message: 'Blog not found' });
    }
});

// POST a new blog
app.post('/api/blogs', (req, res) => {
    const blogs = readBlogs();
    const newBlog = {
        id: Date.now().toString(), // Simple unique ID
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl || '/placeholder-image.jpg', // New field for image URL
        author: req.body.author || 'Admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    blogs.push(newBlog);
    writeBlogs(blogs);
    res.status(201).json(newBlog);
});

// PUT (update) an existing blog
app.put('/api/blogs/:id', (req, res) => {
    const blogs = readBlogs();
    const index = blogs.findIndex(b => b.id === req.params.id);
    if (index !== -1) {
        const updatedBlog = {
            ...blogs[index],
            title: req.body.title || blogs[index].title,
            content: req.body.content || blogs[index].content,
            imageUrl: req.body.imageUrl || blogs[index].imageUrl, // Update image URL
            updatedAt: new Date().toISOString(),
        };
        blogs[index] = updatedBlog;
        writeBlogs(blogs);
        res.json(updatedBlog);
    } else {
        res.status(404).json({ message: 'Blog not found' });
    }
});

// DELETE a blog
app.delete('/api/blogs/:id', (req, res) => {
    let blogs = readBlogs();
    const initialLength = blogs.length;
    blogs = blogs.filter(b => b.id !== req.params.id);
    if (blogs.length < initialLength) {
        writeBlogs(blogs);
        res.status(204).send(); // No Content
    } else {
        res.status(404).json({ message: 'Blog not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
