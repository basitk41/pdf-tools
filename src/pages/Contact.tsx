import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/services/supabaseClient';

const Contact = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const { name, email, subject, message } = data;

    try {
      const { error } = await supabase.from('contact_requests').insert([
        {
          name,
          email,
          subject,
          message,
        },
      ]);

      if (error) throw error;

      toast.success(t('contact_page.success_message'));
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className='container mx-auto px-6 py-12'>
      <motion.h1
        className='text-5xl font-extrabold text-center mb-16 text-gray-900 dark:text-white'
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {t('contact_page.title')}
      </motion.h1>

      <motion.section
        className='mb-16 max-w-4xl mx-auto text-center p-6 bg-white rounded-lg shadow-md dark:bg-gray-800'
        variants={itemVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.5 }}
      >
        <p className='text-lg text-gray-700 dark:text-gray-300 leading-relaxed'>
          {t('contact_page.intro.paragraph1')}
        </p>
      </motion.section>

      <motion.div
        className='grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto'
        variants={containerVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div
          className='bg-white rounded-xl shadow-lg p-10 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
          variants={itemVariants}
        >
          <h2 className='text-3xl font-bold mb-8 text-gray-800 dark:text-white'>
            {t('contact_page.form.title')}
          </h2>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <motion.div variants={itemVariants}>
              <label
                htmlFor='name'
                className='block text-gray-700 text-sm font-semibold mb-2 dark:text-gray-300'
              >
                {t('contact_page.form.name')}
              </label>
              <Input
                type='text'
                id='name'
                name='name'
                placeholder={t('contact_page.form.name')}
                required
                className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <label
                htmlFor='email'
                className='block text-gray-700 text-sm font-semibold mb-2 dark:text-gray-300'
              >
                {t('contact_page.form.email')}
              </label>
              <Input
                type='email'
                id='email'
                name='email'
                placeholder={t('contact_page.form.email')}
                required
                className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <label
                htmlFor='subject'
                className='block text-gray-700 text-sm font-semibold mb-2 dark:text-gray-300'
              >
                {t('contact_page.form.subject')}
              </label>
              <Input
                type='text'
                id='subject'
                name='subject'
                placeholder={t('contact_page.form.subject')}
                required
                className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <label
                htmlFor='message'
                className='block text-gray-700 text-sm font-semibold mb-2 dark:text-gray-300'
              >
                {t('contact_page.form.message')}
              </label>
              <Textarea
                id='message'
                name='message'
                rows={6}
                placeholder={t('contact_page.form.message')}
                required
                className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              />
            </motion.div>
            <motion.div
              whileHover={{
                scale: 1.02,
                boxShadow: '0 8px 15px rgba(0,0,0,0.2)',
              }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
            >
              <Button
                type='submit'
                disabled={isSubmitting}
                className='w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Sending...
                  </>
                ) : (
                  t('contact_page.form.submit_button')
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>

        <motion.div
          className='bg-white rounded-xl shadow-lg p-10 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col justify-between'
          variants={itemVariants}
        >
          <div>
            <h2 className='text-3xl font-bold mb-8 text-gray-800 dark:text-white'>
              {t('contact_page.info.title')}
            </h2>
            <motion.div
              className='space-y-6'
              variants={containerVariants} // Apply container variants for staggered effect here too
              initial='hidden'
              animate='visible'
            >
              <motion.div
                className='flex items-center space-x-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-700'
                variants={itemVariants}
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className='flex items-center justify-center bg-blue-100 w-12 h-12 rounded-full text-blue-600 flex-shrink-0'
                >
                  <Mail className='w-6 h-6' />
                </motion.div>
                <div>
                  <p className='text-gray-700 font-semibold dark:text-gray-300'>
                    {t('contact_page.info.email_label')}
                  </p>
                  <a
                    href={`mailto:${t('contact_page.info.email_address')}`}
                    className='text-blue-600 hover:underline dark:text-blue-400'
                  >
                    {t('contact_page.info.email_address')}
                  </a>
                </div>
              </motion.div>
              {/* Add more contact info like phone, address, social media if needed */}
            </motion.div>
          </div>
          <div className='mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400'>
            <p>{t('contact_page.disclaimer')}</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Contact;
