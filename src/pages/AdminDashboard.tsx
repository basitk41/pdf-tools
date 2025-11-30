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
  const [totalBlogs, setTotalBlogs] = useState<number | null>(null);
  const [totalRequests, setTotalRequests] = useState<number | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<string[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setDashboardLoading(true);
      try {
        // Fetch blogs
        const { data: blogs, error: blogsError } = await supabase
          .from('blogs')
          .select('*')
          .order('createdAt', { ascending: false });

        if (blogsError) throw blogsError;

        // Fetch contact requests
        const { data: requests, error: requestsError } = await supabase
          .from('contact_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (requestsError) throw requestsError;

        setTotalBlogs(blogs?.length || 0);
        setTotalRequests(requests?.length || 0);

        // Combine and sort activities
        const blogActivities = (blogs || []).map((blog) => ({
          date: new Date(blog.created_at),
          text: `New blog post created: "${blog.title}"`,
        }));

        const requestActivities = (requests || []).map((req) => ({
          date: new Date(req.created_at),
          text: `New contact request from ${req.name}: "${req.subject}"`,
        }));

        const allActivities = [...blogActivities, ...requestActivities]
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .slice(0, 10) // Show top 10 recent activities
          .map((activity) => activity.text);

        setRecentActivities(allActivities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setDashboardLoading(false);
      }
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

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Total Blogs Card */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Blogs</CardTitle>
              <Newspaper className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {dashboardLoading ? <Spinner size='sm' /> : totalBlogs}
              </div>
              <p className='text-xs text-muted-foreground'>
                Number of active blog posts
              </p>
            </CardContent>
          </Card>

          {/* Total Requests Card */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Requests
              </CardTitle>
              <MessageSquareText className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {dashboardLoading ? <Spinner size='sm' /> : totalRequests}
              </div>
              <p className='text-xs text-muted-foreground'>
                Total contact form submissions
              </p>
            </CardContent>
          </Card>
        </div>

        <div className='mt-8'>
          <h2 className='text-2xl font-bold text-gray-800 dark:text-white mb-4'>
            Recent Activity
          </h2>
          <Card>
            <CardContent className='p-4'>
              {dashboardLoading ? (
                <div className='flex justify-center p-4'>
                  <Spinner size='md' />
                </div>
              ) : recentActivities.length === 0 ? (
                <p className='text-gray-500'>No recent activity.</p>
              ) : (
                <ul className='space-y-3'>
                  {recentActivities.map((activity, index) => (
                    <li
                      key={index}
                      className='text-gray-700 dark:text-gray-300 border-b last:border-0 pb-2 last:pb-0 border-gray-100 dark:border-gray-800'
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
