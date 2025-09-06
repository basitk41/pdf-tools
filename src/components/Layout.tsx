import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

const Layout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      <Sonner />
    </div>
  );
};

export default Layout;
