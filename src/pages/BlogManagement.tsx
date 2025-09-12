// src/pages/BlogManagement.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/ui/spinner'; // New import

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string; // New field
}

const API_BASE_URL = '/api/blogs'; // Updated to use proxy

const BlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isNewBlogDialogOpen, setIsNewBlogDialogOpen] = useState(false);
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [newBlogImageUrl, setNewBlogImageUrl] = useState(''); // New state for image URL
  const [loading, setLoading] = useState(true); // New state for loading blogs
  const [creatingBlog, setCreatingBlog] = useState(false); // New state for creating blog
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Blog[]>(API_BASE_URL);
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreateBlog = async () => {
    setCreatingBlog(true);
    try {
      const response = await axios.post<Blog>(API_BASE_URL, {
        title: newBlogTitle,
        content: newBlogContent,
        imageUrl: newBlogImageUrl, // Pass the new image URL
      });
      setBlogs([...blogs, response.data]);
      setNewBlogTitle('');
      setNewBlogContent('');
      setNewBlogImageUrl(''); // Clear image URL after creation
      setIsNewBlogDialogOpen(false);
    } catch (error) {
      console.error('Error creating blog:', error);
    } finally {
      setCreatingBlog(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleViewBlog = (id: string) => {
    navigate(`/admin/blogs/${id}`);
  };

  return (
    <div className='p-8'>
      <div className='flex justify-between items-center mb-6'>
        <Button variant='outline' onClick={() => navigate(-1)}>
          &larr; Back
        </Button>
        <h1 className='text-3xl font-bold'>Manage Blogs</h1>
        <Button onClick={() => setIsNewBlogDialogOpen(true)}>
          Create New Blog
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blogs List</CardTitle>
          <CardDescription>All your blog posts at a glance.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex justify-center items-center h-40'>
              <Spinner size='lg' />
            </div>
          ) : blogs.length === 0 ? (
            <p className='text-center text-gray-500'>
              No blogs found. Create one!
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell className='font-medium'>{blog.title}</TableCell>
                    <TableCell>{blog.author}</TableCell>
                    <TableCell>
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className='text-right'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleViewBlog(blog.id)}
                      >
                        View/Edit
                      </Button>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => handleDeleteBlog(blog.id)}
                        className='ml-2'
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* New Blog Dialog */}
      <Dialog open={isNewBlogDialogOpen} onOpenChange={setIsNewBlogDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Blog Post</DialogTitle>
            <DialogDescription>
              Fill in the details for your new blog post.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='title'>Title</Label>
              <Input
                id='title'
                value={newBlogTitle}
                onChange={(e) => setNewBlogTitle(e.target.value)}
                placeholder='My Awesome Blog Post'
                disabled={creatingBlog}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='content'>Content</Label>
              <Textarea
                id='content'
                value={newBlogContent}
                onChange={(e) => setNewBlogContent(e.target.value)}
                placeholder='Write your blog content here...'
                rows={8}
                disabled={creatingBlog}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='imageUrl'>Image URL</Label>
              <Input
                id='imageUrl'
                value={newBlogImageUrl}
                onChange={(e) => setNewBlogImageUrl(e.target.value)}
                placeholder='e.g., https://example.com/blog-image.jpg'
                disabled={creatingBlog}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsNewBlogDialogOpen(false)}
              disabled={creatingBlog}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateBlog} disabled={creatingBlog}>
              {creatingBlog ? <Spinner size='sm' className='mr-2' /> : null}
              Create Blog
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManagement;
