// src/pages/BlogPublicDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '../components/ui/card';
import Spinner from '../components/ui/spinner';
import { Button } from '../components/ui/button';
import { supabase } from '../services/supabaseClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string; // New field
}

const BlogPublicDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogsFromSupabase = async () => {
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

    fetchBlogsFromSupabase();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-[calc(100vh-64px)]'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (!blog) {
    return <div className='p-8 text-center'>Blog post not found.</div>;
  }

  return (
    <div className='container mx-auto p-8 max-w-4xl'>
      <div className='flex items-start gap-4 mb-6 flex-col'>
        <Button variant='outline' onClick={() => navigate(-1)} className='mr-4'>
          &larr; Back to Blogs
        </Button>
        <h1 className='text-2xl md:text-3xl font-bold'>{blog.title}</h1>
      </div>

      <Card className='overflow-hidden'>
        {blog.imageUrl && (
          <div className='w-full h-80'>
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className='w-full h-full object-cover'
            />
          </div>
        )}
        <CardHeader>
          <CardDescription className='text-sm text-gray-500 dark:text-gray-400'>
            By {blog.author} on{' '}
            {new Date(blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </CardDescription>
          {blog.createdAt !== blog.updatedAt && (
            <p className='text-sm text-gray-500'>
              Last updated:{' '}
              {new Date(blog.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className='prose dark:prose-invert max-w-none'>
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              rehypePlugins={[rehypeRaw]}
            >
              {blog.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogPublicDetailPage;
