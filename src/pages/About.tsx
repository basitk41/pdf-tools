import { useTranslation } from 'react-i18next';
import { ShieldCheck, Zap, CircleDollarSign } from 'lucide-react';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className='container mx-auto px-8 py-8'>
      <h1 className='text-4xl font-bold text-center mb-12 dark:text-white'>
        {t('about.title')}
      </h1>

      <section className='mb-12'>
        <h2 className='text-3xl font-semibold mb-6 dark:text-white'>
          {t('about.intro.title')}
        </h2>
        <p className='text-lg text-gray-700 mb-4 dark:text-gray-300'>
          {t('about.intro.paragraph1')}
        </p>
        <p className='text-lg text-gray-700 dark:text-gray-300'>
          {t('about.intro.paragraph2')}
        </p>
      </section>

      <section className='mb-12'>
        <h2 className='text-3xl font-semibold mb-6 dark:text-white'>
          {t('about.mission.title')}
        </h2>
        <p className='text-lg text-gray-700 dark:text-gray-300'>
          {t('about.mission.paragraph1')}
        </p>
      </section>

      <section className='mb-12'>
        <h2 className='text-3xl font-semibold mb-6 dark:text-white'>
          {t('about.key_features.title')}
        </h2>
        <div className='grid md:grid-cols-3 gap-8'>
          <div className='bg-white rounded-lg p-6 shadow-md text-center dark:bg-gray-800'>
            <div className='bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
              <ShieldCheck className='text-blue-600 w-8 h-8' />
            </div>
            <h3 className='text-xl font-semibold text-gray-800 mb-2 dark:text-white'>
              {t('about.key_features.privacy.title')}
            </h3>
            <p className='text-gray-600 dark:text-gray-400'>
              {t('about.key_features.privacy.description')}
            </p>
          </div>
          <div className='bg-white rounded-lg p-6 shadow-md text-center dark:bg-gray-800'>
            <div className='bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Zap className='text-green-600 w-8 h-8' />
            </div>
            <h3 className='text-xl font-semibold text-gray-800 mb-2 dark:text-white'>
              {t('about.key_features.speed.title')}
            </h3>
            <p className='text-gray-600 dark:text-gray-400'>
              {t('about.key_features.speed.description')}
            </p>
          </div>
          <div className='bg-white rounded-lg p-6 shadow-md text-center dark:bg-gray-800'>
            <div className='bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
              <CircleDollarSign className='text-purple-600 w-8 h-8' />
            </div>
            <h3 className='text-xl font-semibold text-gray-800 mb-2 dark:text-white'>
              {t('about.key_features.cost.title')}
            </h3>
            <p className='text-gray-600 dark:text-gray-400'>
              {t('about.key_features.cost.description')}
            </p>
          </div>
        </div>
      </section>

      <section className='mb-12'>
        <h2 className='text-3xl font-semibold mb-6 dark:text-white'>
          {t('about.tech_stack.title')}
        </h2>
        <p className='text-lg text-gray-700 dark:text-gray-300'>
          {t('about.tech_stack.description')}
        </p>
      </section>

      <section className='mb-12'>
        <h2 className='text-3xl font-semibold mb-6 dark:text-white'>
          {t('about.team.title')}
        </h2>
        <p className='text-lg text-gray-700 dark:text-gray-300'>
          {t('about.team.paragraph1')}
        </p>
      </section>

      <section>
        <h2 className='text-3xl font-semibold mb-6 dark:text-white'>
          {t('about.contact.title')}
        </h2>
        <p className='text-lg text-gray-700 dark:text-gray-300'>
          {t('about.contact.paragraph1')}
        </p>
      </section>
    </div>
  );
};

export default About;
