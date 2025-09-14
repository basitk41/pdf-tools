// src/pages/BlogManagement.tsx
import React, { useEffect, useState } from 'react';
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
import { supabase } from '@/services/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '../components/AdminSidebar'; // New import

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string; // New field
}

const BlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isNewBlogDialogOpen, setIsNewBlogDialogOpen] = useState(false);
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [newBlogImageUrl, setNewBlogImageUrl] = useState(''); // New state for image URL
  const [pageLoading, setPageLoading] = useState(true); // New state for loading blogs
  const [isCreatingBlog, setIsCreatingBlog] = useState(false); // New state for creating blog
  const navigate = useNavigate();
  const { loading: authLoading } = useAuth(); // Destructure loading from useAuth

  const fetchBlogs = async () => {
    setPageLoading(true);
    const { data, error } = await supabase.from('blogs').select('*');
    if (error) {
      console.error('Error fetching blogs from Supabase:', error);
      setPageLoading(false);
    } else {
      setBlogs(data);
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreateBlog = async () => {
    setIsCreatingBlog(true);
    const { data, error } = await supabase
      .from('blogs')
      .insert({
        title: newBlogTitle,
        content: newBlogContent,
        imageUrl: newBlogImageUrl,
        author: 'Admin',
      })
      .select('*');
    if (error) {
      console.error('Error fetching blogs from Supabase:', error);
    } else {
      setBlogs([...blogs, ...data]);
      setNewBlogTitle('');
      setNewBlogContent('');
      setNewBlogImageUrl(''); // Clear image URL after creation
      setIsNewBlogDialogOpen(false);
      setIsCreatingBlog(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    setIsCreatingBlog(true);
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)
      .select('*');
    if (error) {
      console.error('Error fetching blogs from Supabase:', error);
      setIsCreatingBlog(false);
    } else {
      setBlogs(blogs.filter((blog) => blog.id !== id));
      setIsCreatingBlog(false);
    }
  };

  const handleViewBlog = (id: string) => {
    navigate(`/admin/blogs/${id}`);
  };

  return (
    <div className='block md:flex min-h-screen bg-gray-100 dark:bg-gray-900'>
      <AdminSidebar loading={authLoading} />
      <main className='flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0 md:ml-0 sm:ml-0 mt-16 lg:mt-0'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
          <h1 className='text-2xl sm:text-3xl font-bold text-center sm:text-left'>
            Manage Blogs
          </h1>
          <div className='w-full sm:w-auto flex justify-end'>
            <Button
              onClick={() => setIsNewBlogDialogOpen(true)}
              className='w-full sm:w-auto'
            >
              Create New Blog
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Blogs List</CardTitle>
            <CardDescription>All your blog posts at a glance.</CardDescription>
          </CardHeader>
          <CardContent>
            {pageLoading ? (
              <div className='flex justify-center items-center h-40'>
                <Spinner size='lg' />
              </div>
            ) : blogs.length === 0 ? (
              <p className='text-center text-gray-500'>
                No blogs found. Create one!
              </p>
            ) : (
              <div className='overflow-x-auto'>
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
                        <TableCell className='font-medium'>
                          {blog.title}
                        </TableCell>
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
                            className='mt-2 md:ml-2 md:mt-0'
                            disabled={isCreatingBlog}
                          >
                            {isCreatingBlog ? 'Deleting...' : 'Delete'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* New Blog Dialog */}
        <Dialog
          open={isNewBlogDialogOpen}
          onOpenChange={setIsNewBlogDialogOpen}
        >
          <DialogContent className='sm:max-w-lg'>
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
                  disabled={isCreatingBlog}
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
                  disabled={isCreatingBlog}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='imageUrl'>Image URL</Label>
                <Input
                  id='imageUrl'
                  value={newBlogImageUrl}
                  onChange={(e) => setNewBlogImageUrl(e.target.value)}
                  placeholder='e.g., https://example.com/blog-image.jpg'
                  disabled={isCreatingBlog}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setIsNewBlogDialogOpen(false)}
                disabled={isCreatingBlog}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateBlog} disabled={isCreatingBlog}>
                {isCreatingBlog ? <Spinner size='sm' className='mr-2' /> : null}
                Create Blog
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default BlogManagement;
