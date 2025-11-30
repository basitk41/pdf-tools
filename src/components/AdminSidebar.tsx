import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { LayoutDashboard, Newspaper, Users, Settings, MessageSquareText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '../components/ui/sheet';
import { MenuIcon } from 'lucide-react';

interface AdminSidebarProps {
  loading: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ loading }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild className='lg:hidden fixed top-4 left-4 z-50'>
          <Button variant='outline' size='icon'>
            <MenuIcon className='h-6 w-6' />
          </Button>
        </SheetTrigger>
        <SheetContent side='left' className='p-4 w-64 flex flex-col'>
          <h2 className='text-2xl font-bold text-gray-800 dark:text-white mb-4'>
            Admin Panel
          </h2>
          <Separator />
          <nav className='space-y-2 mt-4 flex-1'>
            <SheetClose asChild>
              <Button
                variant='ghost'
                className='w-full justify-start flex items-center gap-2'
                onClick={() => navigate('/admin/dashboard')}
              >
                <LayoutDashboard className='h-4 w-4' /> Dashboard
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button
                variant='ghost'
                className='w-full justify-start flex items-center gap-2'
                onClick={() => navigate('/admin/blogs')}
              >
                <Newspaper className='h-4 w-4' /> Manage Blogs
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button
                variant='ghost'
                className='w-full justify-start flex items-center gap-2'
                onClick={() => navigate('/admin/contact-requests')}
              >
                <MessageSquareText className='h-4 w-4' /> Contact Requests
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button
                variant='ghost'
                className='w-full justify-start flex items-center gap-2'
              >
                <Users className='h-4 w-4' /> Users
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button
                variant='ghost'
                className='w-full justify-start flex items-center gap-2'
              >
                <Settings className='h-4 w-4' /> Settings
              </Button>
            </SheetClose>
          </nav>
          <div className='mt-auto space-y-2 border-t pt-4'>
            <SheetClose asChild>
              <Button
                variant='outline'
                className='w-full'
                onClick={() => navigate('/')}
              >
                Visit Site
              </Button>
            </SheetClose>
            <Button
              variant='destructive'
              className='w-full'
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className='hidden lg:flex flex-col w-64 bg-white dark:bg-gray-800 shadow-md p-4 space-y-4 sticky top-0 h-screen'>
        <div className='flex flex-col flex-1'>
          <h2 className='text-2xl font-bold text-gray-800 dark:text-white'>
            Admin Panel
          </h2>
          <Separator />
          <nav className='space-y-2 mt-4'>
            <Button
              variant='ghost'
              className='w-full justify-start flex items-center gap-2'
              onClick={() => navigate('/admin/dashboard')}
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
              onClick={() => navigate('/admin/contact-requests')}
            >
              <MessageSquareText className='h-4 w-4' /> Contact Requests
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
        </div>
        <div className='space-y-2'>
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
    </>
  );
};

export default AdminSidebar;
