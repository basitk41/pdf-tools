// src/pages/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import Spinner from '../components/ui/spinner'; // New import
import { Newspaper, Users, MessageSquareText } from 'lucide-react'; // New icons
import { supabase } from '@/services/supabaseClient';
import AdminSidebar from '../components/AdminSidebar'; // New import

const AdminDashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const [totalBlogs, setTotalBlogs] = useState<number | null>(null); // New state
  const [blogsLoading, setBlogsLoading] = useState(true); // New state
  const [newComments, setNewComments] = useState<number | null>(null);
  const [usersRegistered, setUsersRegistered] = useState<number | null>(null);
  const [recentActivities, setRecentActivities] = useState<string[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Fetch total blogs
      const { data, error } = await supabase.from('blogs').select('*');
      if (error) {
        console.error('Error fetching blogs from Supabase:', error);
        setBlogsLoading(false);
        setTotalBlogs(0);
      } else {
        setTotalBlogs(data.length);
        setBlogsLoading(false);
      }

      // Mock data for other cards for now
      setNewComments(Math.floor(Math.random() * 50)); // Random comments
      setUsersRegistered(Math.floor(Math.random() * 1000)); // Random users

      // Mock recent activities
      setRecentActivities([
        "User 'John Doe' created a new blog post.",
        "User 'Jane Smith' commented on 'My First Blog'.",
        `Admin '{user?.username}' updated settings.`,
        "User 'Alice' registered for an account.",
        "Blog post 'Hello World' was deleted.",
      ]);
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div className='flex min-h-screen bg-gray-100 dark:bg-gray-900'>
      <AdminSidebar loading={loading} />

      {/* Main content */}
      <main className='flex-1 p-8 lg:ml-0 md:ml-0 sm:ml-0'>
        <div className='flex justify-between items-center mb-6 mt-16 lg:mt-0'>
          <h1 className='text-3xl font-bold text-gray-800 dark:text-white'>
            Welcome, <span className='hidden sm:inline'>{user?.username}</span>
            <span className='sm:hidden'>Admin</span>!
          </h1>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* Total Blogs Card */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Blogs</CardTitle>
              <Newspaper className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {blogsLoading ? <Spinner size='sm' /> : totalBlogs}
              </div>
              <p className='text-xs text-muted-foreground'>
                Number of active blog posts
              </p>
            </CardContent>
          </Card>

          {/* New Comments Card */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                New Comments
              </CardTitle>
              <MessageSquareText className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {newComments === null ? <Spinner size='sm' /> : newComments}
              </div>
              <p className='text-xs text-muted-foreground'>
                Comments awaiting moderation
              </p>
            </CardContent>
          </Card>

          {/* User Registrations Card */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                User Registrations
              </CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {usersRegistered === null ? (
                  <Spinner size='sm' />
                ) : (
                  usersRegistered
                )}
              </div>
              <p className='text-xs text-muted-foreground'>
                New users this month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className='mt-8'>
          <h2 className='text-2xl font-bold text-gray-800 dark:text-white'>
            Recent Activity
          </h2>
          <Card>
            <CardContent className='p-4'>
              {recentActivities.length === 0 ? (
                <p className='text-gray-500'>No recent activity.</p>
              ) : (
                <ul className='space-y-2'>
                  {recentActivities.map((activity, index) => (
                    <li
                      key={index}
                      className='text-gray-700 dark:text-gray-300'
                    >
                      {activity}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
