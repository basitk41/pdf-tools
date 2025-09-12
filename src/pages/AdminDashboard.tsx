// src/pages/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import axios from 'axios'; // New import
import Spinner from '../components/ui/spinner'; // New import
import {
  LayoutDashboard,
  Newspaper,
  Users,
  Settings,
  MessageSquareText,
} from 'lucide-react'; // New icons

const AdminDashboard: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [totalBlogs, setTotalBlogs] = useState<number | null>(null); // New state
  const [blogsLoading, setBlogsLoading] = useState(true); // New state
  const [newComments, setNewComments] = useState<number | null>(null);
  const [usersRegistered, setUsersRegistered] = useState<number | null>(null);
  const [recentActivities, setRecentActivities] = useState<string[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Fetch total blogs
      try {
        const response = await axios.get(
          'http://212.132.93.153:3001/api/blogs'
        );
        setTotalBlogs(response.data.length);
      } catch (error) {
        console.error('Error fetching total blogs:', error);
        setTotalBlogs(0); // Default to 0 on error
      } finally {
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

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className='flex min-h-screen bg-gray-100 dark:bg-gray-900'>
      {/* Sidebar */}
      <aside className='w-64 bg-white dark:bg-gray-800 shadow-md p-4 space-y-4'>
        <h2 className='text-2xl font-bold text-gray-800 dark:text-white'>
          Admin Panel
        </h2>
        <Separator />
        <nav className='space-y-2'>
          <Button
            variant='ghost'
            className='w-full justify-start flex items-center gap-2'
          >
            <LayoutDashboard className='h-4 w-4' /> Dashboard
          </Button>
          <Button
            variant='ghost'
            className='w-full justify-start flex items-center gap-2'
            onClick={() => navigate('/admin/blogs')}
          >
            <Newspaper className='h-4 w-4' /> Manage Blogs
          </Button>
          <Button
            variant='ghost'
            className='w-full justify-start flex items-center gap-2'
          >
            <Users className='h-4 w-4' /> Users
          </Button>
          <Button
            variant='ghost'
            className='w-full justify-start flex items-center gap-2'
          >
            <Settings className='h-4 w-4' /> Settings
          </Button>
        </nav>
        <div className='absolute bottom-4 left-4 w-56 space-y-2'>
          <Button
            variant='outline'
            className='w-full'
            onClick={() => navigate('/')}
          >
            Visit Site
          </Button>
          <Button
            variant='destructive'
            className='w-full'
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className='flex-1 p-8'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold text-gray-800 dark:text-white'>
            Welcome, {user?.username}!
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
          <h2 className='text-2xl font-bold text-gray-800 dark:text-white mb-4'>
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
