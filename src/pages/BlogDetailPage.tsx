// src/pages/BlogDetailPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import BlogForm from '../components/BlogForm';
import Spinner from '../components/ui/spinner';

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

const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get<Blog>(`${API_BASE_URL}/${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error('Error fetching blog:', error);
        navigate('/admin/blogs'); // Redirect if blog not found
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, navigate]);

  const handleUpdateBlog = async (data: { title: string; content: string }) => {
    if (!id) return;
    setSubmitting(true);
    try {
      const response = await axios.put<Blog>(`${API_BASE_URL}/${id}`, data);
      setBlog(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating blog:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='p-8 flex justify-center items-center h-[calc(100vh-64px)]'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (!blog) {
    return <div className='p-8'>Blog not found.</div>;
  }

  return (
    <div className='p-8'>
      <div className='flex justify-between items-center mb-6'>
        <Button variant='outline' onClick={() => navigate(-1)}>
          &larr; Back to Blogs
        </Button>
        <h1 className='text-3xl font-bold'>
          {isEditing ? 'Edit Blog' : blog.title}
        </h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>Edit Blog</Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{blog.title}</CardTitle>
          <CardDescription>
            By {blog.author} on {new Date(blog.createdAt).toLocaleDateString()}
          </CardDescription>
          {blog.createdAt !== blog.updatedAt && (
            <p className='text-sm text-gray-500'>
              Last updated: {new Date(blog.updatedAt).toLocaleDateString()}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <BlogForm
              initialData={{
                title: blog.title,
                content: blog.content,
                imageUrl: blog.imageUrl,
              }}
              onSubmit={handleUpdateBlog}
              onCancel={() => setIsEditing(false)}
              submitButtonText='Save Changes'
              isSubmitting={submitting}
            />
          ) : (
            <>
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className='w-64 h-48 mb-4 rounded'
              />
              <p className='text-gray-700 whitespace-pre-line'>
                {blog.content}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogDetailPage;
