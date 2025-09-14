import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className='bg-gray-800 text-white py-12'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div>
            <h3 className='text-xl font-bold mb-4'>{t('common.title')}</h3>
            <p className='text-gray-400'>{t('footer.description')}</p>
          </div>

          <div>
            <h4 className='font-semibold mb-4'>{t('footer.tools')}</h4>
            <ul className='space-y-2'>
              <li>
                <Link
                  to='/merge-pdf'
                  className='text-gray-400 hover:text-white'
                >
                  {t('footer.merge_pdf')}
                </Link>
              </li>
              <li>
                <Link
                  to='/split-pdf'
                  className='text-gray-400 hover:text-white'
                >
                  {t('footer.split_pdf')}
                </Link>
              </li>
              <li>
                <Link
                  to='/pdf-to-word'
                  className='text-gray-400 hover:text-white'
                >
                  {t('footer.pdf_to_word')}
                </Link>
              </li>
              <li>
                <Link
                  to='/word-to-pdf'
                  className='text-gray-400 hover:text-white'
                >
                  {t('footer.word_to_pdf')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='font-semibold mb-4'>{t('footer.company')}</h4>
            <ul className='space-y-2'>
              <li>
                <Link to='/about' className='text-gray-400 hover:text-white'>
                  {t('footer.about_us')}
                </Link>
              </li>
              <li>
                <Link to='/contact' className='text-gray-400 hover:text-white'>
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link to='/privacy' className='text-gray-400 hover:text-white'>
                  {t('footer.privacy_policy')}
                </Link>
              </li>
              <li>
                <Link to='/terms' className='text-gray-400 hover:text-white'>
                  {t('footer.terms_of_service')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='font-semibold mb-4'>{t('footer.connect')}</h4>
            <div className='flex space-x-4'>
              <a
                href='#'
                className='text-gray-400 hover:text-white'
                aria-label='Facebook'
              >
                <Facebook size={20} />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-white'
                aria-label='Twitter'
              >
                <Twitter size={20} />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-white'
                aria-label='Instagram'
              >
                <Instagram size={20} />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-white'
                aria-label='LinkedIn'
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className='border-t border-gray-700 mt-8 pt-8 text-center text-gray-400'>
          <p>
            &copy; {new Date().getFullYear()} {t('common.title')}.{' '}
            {t('footer.rights_reserved')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
