// src/pages/Blogs.tsx
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import Spinner from '../components/ui/spinner';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { supabase } from '../services/supabaseClient';

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string; // New field
}

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogsFromSupabase = async () => {
      const { data, error } = await supabase.from('blogs').select('*');
      if (error) {
        console.error('Error fetching blogs from Supabase:', error);
        setLoading(false);
      } else {
        setBlogs(data);
        setLoading(false);
      }
    };

    fetchBlogsFromSupabase();
  }, []);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-[calc(100vh-64px)]'>
        <Spinner size='lg' />
      </div>
    );
  }

  return (
    <div className='container mx-auto p-8 max-w-4xl'>
      <h1 className='text-4xl font-bold mb-8 text-center'>Our Latest Blogs</h1>
      {blogs.length === 0 ? (
        <p className='text-center text-gray-500'>
          No blog posts available yet. Check back soon!
        </p>
      ) : (
        // <div className='space-y-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {blogs.map((blog) => (
            <Card
              key={blog.id}
              className='flex flex-col md:flex-col overflow-hidden'
            >
              {blog.imageUrl && (
                <div className='w-full h-48 md:h-64'>
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className='w-full h-48 object-cover md:h-full'
                  />
                </div>
              )}
              <div className='p-6 flex flex-col justify-between'>
                <CardHeader className='p-0 mb-4'>
                  <CardTitle className='text-xl font-bold'>
                    {blog.title}
                  </CardTitle>
                  <CardDescription className='text-sm text-gray-500 dark:text-gray-400'>
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className='p-0 mb-4 flex-grow'>
                  <p className='text-gray-700 dark:text-gray-300 line-clamp-3'>
                    {blog.content}
                  </p>
                </CardContent>
                <Link to={`/blogs/${blog.id}`}>
                  <Button variant='link' className='p-0 h-auto'>
                    Read More &rarr;
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;
