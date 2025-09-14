// src/pages/BlogDetailPage.tsx
import React, { useEffect, useState } from 'react';
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
import { supabase } from '@/services/supabaseClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import AdminSidebar from '../components/AdminSidebar'; // New import
import { useAuth } from '@/context/AuthContext'; // New import

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string; // New field
}

const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { loading: authLoading } = useAuth(); // Get auth loading state

  useEffect(() => {
    const fetchBlog = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        console.error('Error fetching blogs from Supabase:', error);
        setLoading(false);
        navigate('/blogs');
      } else {
        setBlog(data);
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, navigate]);

  const handleUpdateBlog = async (inputData: {
    title: string;
    content: string;
  }) => {
    if (!id) return;
    setSubmitting(true);
    const { data, error } = await supabase
      .from('blogs')
      .update(inputData)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('Error updating blog from Supabase:', error);
    } else {
      setBlog(data);
      setIsEditing(false);
    }
    setSubmitting(false);
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
    <div className='flex min-h-screen bg-gray-100 dark:bg-gray-900'>
      <AdminSidebar loading={authLoading} />
      <main className='flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0 md:ml-0 sm:ml-0 mt-16 lg:mt-0'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
          <h1 className='text-2xl sm:text-3xl font-bold text-center sm:text-left'>
            {isEditing ? 'Edit Blog' : blog.title}
          </h1>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className='w-full sm:w-auto'
            >
              Edit Blog
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{blog.title}</CardTitle>
            <CardDescription>
              By {blog.author} on{' '}
              {new Date(blog.createdAt).toLocaleDateString()}
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
                {blog.imageUrl && (
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className='w-full sm:w-64 h-auto sm:h-48 mb-4 rounded object-cover'
                  />
                )}
                <div className='prose dark:prose-invert max-w-none'>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {blog.content}
                  </ReactMarkdown>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BlogDetailPage;
