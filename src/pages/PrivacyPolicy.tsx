import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div className='container mx-auto px-6 py-12'>
      <motion.h1 className='text-5xl font-extrabold text-center mb-8 text-gray-900 dark:text-white leading-tight'>
        {t('privacy_policy.title')}
      </motion.h1>
      <motion.p className='text-center text-gray-500 mb-16 dark:text-gray-400 text-lg'>
        {t('privacy_policy.last_updated')}
      </motion.p>

      <motion.section
        className='mb-12 p-8 bg-white rounded-lg shadow-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
        variants={sectionVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
      >
        <p className='text-lg text-gray-700 mb-4 dark:text-gray-300 leading-relaxed'>
          {t('privacy_policy.intro.paragraph1')}
        </p>
      </motion.section>

      <motion.section
        className='mb-12 p-8 bg-white rounded-lg shadow-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
        variants={sectionVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2 className='text-3xl font-bold mb-6 text-gray-800 dark:text-white leading-tight'>
          {t('privacy_policy.information_we_collect.title')}
        </motion.h2>
        <p className='text-lg text-gray-700 dark:text-gray-300 leading-relaxed'>
          {t('privacy_policy.information_we_collect.paragraph1')}
        </p>
      </motion.section>

      <motion.section
        className='mb-12 p-8 bg-white rounded-lg shadow-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
        variants={sectionVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2 className='text-3xl font-bold mb-6 text-gray-800 dark:text-white leading-tight'>
          {t('privacy_policy.how_we_use_your_information.title')}
        </motion.h2>
        <p className='text-lg text-gray-700 dark:text-gray-300 leading-relaxed'>
          {t('privacy_policy.how_we_use_your_information.paragraph1')}
        </p>
      </motion.section>

      <motion.section
        className='mb-12 p-8 bg-white rounded-lg shadow-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
        variants={sectionVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2 className='text-3xl font-bold mb-6 text-gray-800 dark:text-white leading-tight'>
          {t('privacy_policy.data_security.title')}
        </motion.h2>
        <p className='text-lg text-gray-700 dark:text-gray-300 leading-relaxed'>
          {t('privacy_policy.data_security.paragraph1')}
        </p>
      </motion.section>

      <motion.section
        className='mb-12 p-8 bg-white rounded-lg shadow-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
        variants={sectionVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2 className='text-3xl font-bold mb-6 text-gray-800 dark:text-white leading-tight'>
          {t('privacy_policy.changes_to_this_policy.title')}
        </motion.h2>
        <p className='text-lg text-gray-700 dark:text-gray-300 leading-relaxed'>
          {t('privacy_policy.changes_to_this_policy.paragraph1')}
        </p>
      </motion.section>

      <motion.section
        className='p-8 bg-white rounded-lg shadow-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
        variants={sectionVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2 className='text-3xl font-bold mb-6 text-gray-800 dark:text-white leading-tight'>
          {t('privacy_policy.contact_us.title')}
        </motion.h2>
        <p className='text-lg text-gray-700 dark:text-gray-300 leading-relaxed'>
          {t('privacy_policy.contact_us.paragraph1')}
        </p>
      </motion.section>
    </div>
  );
};

export default PrivacyPolicy;
