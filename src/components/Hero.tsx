import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className='bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16'>
      <div className='text-center'>
        <h1 className='text-4xl md:text-5xl font-bold mb-4 slide-up'>
          {t('hero.title')}
        </h1>
        <p className='text-lg mb-8 max-w-2xl mx-auto slide-up md:text-xl'>
          {t('hero.subtitle')}
        </p>
        <Link
          to='/tools'
          className='bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 slide-up'
        >
          {t('hero.button')}
        </Link>
      </div>
    </section>
  );
};

export default Hero;
