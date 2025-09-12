import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, FileText } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t } = useTranslation();

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/tools', label: t('nav.tools') },
    { to: '/blogs', label: t('nav.blogs') }, // New blog link
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <header className='sticky top-0 z-50 w-full bg-white shadow-md dark:bg-gray-800'>
      <div className='container mx-auto px-4 py-3 flex justify-between items-center'>
        <Link to='/' className='flex items-center space-x-2'>
          <FileText className='text-red-600 h-8 w-8' />
          <span className='text-xl font-bold text-gray-800 dark:text-white'>
            {t('common.title')}
          </span>
        </Link>

        <nav className='hidden md:flex items-center space-x-6'>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className='text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
            >
              {link.label}
            </Link>
          ))}
          <LanguageToggle />
          <ThemeToggle />
        </nav>

        <div className='flex items-center space-x-2 md:hidden'>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon'>
                <Menu className='h-6 w-6' />
                <span className='sr-only'>Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left'>
              <div className='flex flex-col space-y-4'>
                <Link to='/' className='flex items-center space-x-2'>
                  <FileText className='text-red-600 h-8 w-8' />
                  <span className='text-xl font-bold'>{t('common.title')}</span>
                </Link>
                <nav className='flex flex-col space-y-2 text-lg'>
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className='py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700'
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className='flex space-x-2 mt-4'>
                    <LanguageToggle />
                    <ThemeToggle />
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
