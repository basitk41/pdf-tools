import { useTranslation } from 'react-i18next';
import { ShieldCheck, Zap, CircleDollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const About = () => {
  const { t } = useTranslation();

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const iconVariants = {
    hover: { scale: 1.1, rotate: 5, transition: { duration: 0.3 } },
  };

  return (
    <div className='container mx-auto px-8 py-12'>
      <motion.h1
        className='text-5xl font-extrabold text-center mb-16 text-gray-900 dark:text-white'
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {t('about.title')}
      </motion.h1>

      <motion.section
        className='mb-16 p-8 bg-white rounded-lg shadow-md dark:bg-gray-800'
        variants={sectionVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className='text-4xl font-bold mb-6 text-gray-800 dark:text-white leading-tight'
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {t('about.intro.title')}
        </motion.h2>
        <p className='text-lg text-gray-700 mb-4 dark:text-gray-300 leading-relaxed'>
          {t('about.intro.paragraph1')}
        </p>
        <p className='text-lg text-gray-700 dark:text-gray-300 leading-relaxed'>
          {t('about.intro.paragraph2')}
        </p>
      </motion.section>

      <motion.section
        className='mb-16 p-8 bg-white rounded-lg shadow-md dark:bg-gray-800'
        variants={sectionVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className='text-4xl font-bold mb-6 text-gray-800 dark:text-white leading-tight'
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {t('about.mission.title')}
        </motion.h2>
        <p className='text-lg text-gray-700 dark:text-gray-300 leading-relaxed'>
          {t('about.mission.paragraph1')}
        </p>
      </motion.section>

      <motion.section
        className='mb-16 p-8 bg-blue-50 rounded-lg shadow-inner dark:bg-gray-900 dark:shadow-none'
        variants={sectionVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className='text-4xl font-bold mb-12 text-center text-blue-800 dark:text-blue-300 leading-tight'
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {t('about.key_features.title')}
        </motion.h2>
        <div className='grid md:grid-cols-3 gap-10'>
          <motion.div
            className='bg-white rounded-xl p-8 shadow-lg text-center dark:bg-gray-800 transform hover:scale-105 transition-transform duration-300'
            whileHover='hover'
            variants={iconVariants}
          >
            <div className='bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-inner'>
              <ShieldCheck className='w-10 h-10' />
            </div>
            <h3 className='text-2xl font-semibold text-gray-800 mb-3 dark:text-white'>
              {t('about.key_features.privacy.title')}
            </h3>
            <p className='text-gray-600 dark:text-gray-400 text-base leading-relaxed'>
              {t('about.key_features.privacy.description')}
            </p>
          </motion.div>
          <motion.div
            className='bg-white rounded-xl p-8 shadow-lg text-center dark:bg-gray-800 transform hover:scale-105 transition-transform duration-300'
            whileHover='hover'
            variants={iconVariants}
          >
            <div className='bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-inner'>
              <Zap className='w-10 h-10' />
            </div>
            <h3 className='text-2xl font-semibold text-gray-800 mb-3 dark:text-white'>
              {t('about.key_features.speed.title')}
            </h3>
            <p className='text-gray-600 dark:text-gray-400 text-base leading-relaxed'>
              {t('about.key_features.speed.description')}
            </p>
          </motion.div>
          <motion.div
            className='bg-white rounded-xl p-8 shadow-lg text-center dark:bg-gray-800 transform hover:scale-105 transition-transform duration-300'
            whileHover='hover'
            variants={iconVariants}
          >
            <div className='bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-600 shadow-inner'>
              <CircleDollarSign className='w-10 h-10' />
            </div>
            <h3 className='text-2xl font-semibold text-gray-800 mb-3 dark:text-white'>
              {t('about.key_features.cost.title')}
            </h3>
            <p className='text-gray-600 dark:text-gray-400 text-base leading-relaxed'>
              {t('about.key_features.cost.description')}
            </p>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className='mb-16 p-8 bg-white rounded-lg shadow-md dark:bg-gray-800'
        variants={sectionVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className='text-4xl font-bold mb-6 text-gray-800 dark:text-white leading-tight'
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {t('about.tech_stack.title')}
        </motion.h2>
        <p className='text-lg text-gray-700 dark:text-gray-300 leading-relaxed'>
          {t('about.tech_stack.description')}
        </p>
      </motion.section>

      <motion.section
        className='mb-16 p-8 bg-white rounded-lg shadow-md dark:bg-gray-800'
        variants={sectionVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className='text-4xl font-bold mb-6 text-gray-800 dark:text-white leading-tight'
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {t('about.team.title')}
        </motion.h2>
        <p className='text-lg text-gray-700 dark:text-gray-300 leading-relaxed'>
          {t('about.team.paragraph1')}
        </p>
      </motion.section>

      <motion.section
        className='p-8 bg-white rounded-lg shadow-md dark:bg-gray-800'
        variants={sectionVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className='text-4xl font-bold mb-6 text-gray-800 dark:text-white leading-tight'
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {t('about.contact.title')}
        </motion.h2>
        <p className='text-lg text-gray-700 dark:text-gray-300 leading-relaxed'>
          {t('about.contact.paragraph1')}
        </p>
      </motion.section>
    </div>
  );
};

export default About;
