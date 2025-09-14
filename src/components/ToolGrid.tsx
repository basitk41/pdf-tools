import { useTranslation } from 'react-i18next';
import ToolCard from './ToolCard';
import { motion } from 'framer-motion';
import {
  FileType,
  FileText,
  FileSpreadsheet,
  FileChartPie,
  FileEdit,
  Combine,
  Split,
} from 'lucide-react';

const ToolGrid = () => {
  const { t } = useTranslation();

  const tools = [
    {
      to: '/pdf-to-word',
      icon: <FileType className='text-blue-600 w-8 h-8' />,
      title: t('tools.pdf_to_word.title'),
      description: t('tools.pdf_to_word.description'),
    },
    {
      to: '/word-to-pdf',
      icon: <FileType className='text-red-600 w-8 h-8' />,
      title: t('tools.word_to_pdf.title'),
      description: t('tools.word_to_pdf.description'),
    },
    {
      to: '/pdf-to-excel',
      icon: <FileSpreadsheet className='text-green-600 w-8 h-8' />,
      title: t('tools.pdf_to_excel.title'),
      description: t('tools.pdf_to_excel.description'),
    },
    {
      to: '/excel-to-pdf',
      icon: <FileText className='text-red-600 w-8 h-8' />,
      title: t('tools.excel_to_pdf.title'),
      description: t('tools.excel_to_pdf.description'),
    },
    {
      to: '/pdf-to-powerpoint',
      icon: <FileChartPie className='text-orange-600 w-8 h-8' />,
      title: t('tools.pdf_to_powerpoint.title'),
      description: t('tools.pdf_to_powerpoint.description'),
    },
    {
      to: '/powerpoint-to-pdf',
      icon: <FileChartPie className='text-yellow-600 w-8 h-8' />,
      title: t('tools.powerpoint_to_pdf.title'),
      description: t('tools.powerpoint_to_pdf.description'),
    },
    {
      to: '/pdf-editor',
      icon: <FileEdit className='text-purple-600 w-8 h-8' />,
      title: t('tools.edit_pdf.title'),
      description: t('tools.edit_pdf.description'),
    },
    {
      to: '/merge-pdf',
      icon: <Combine className='text-yellow-600 w-8 h-8' />,
      title: t('tools.merge_pdf.title'),
      description: t('tools.merge_pdf.description'),
    },
    {
      to: '/split-pdf',
      icon: <Split className='text-pink-600 w-8 h-8' />,
      title: t('tools.split_pdf.title'),
      description: t('tools.split_pdf.description'),
    },
  ];

  return (
    <section id='tools' className='py-20 bg-gray-50 dark:bg-gray-900'>
      <div className='container mx-auto px-6'>
        <h2 className='text-4xl font-extrabold text-center text-gray-800 mb-16 dark:text-white'>
          {t('nav.tools')}
        </h2>
        <motion.div
          className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'
          variants={{
            hidden: { opacity: 1 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial='hidden'
          animate='visible'
        >
          {tools.map((tool) => (
            <ToolCard
              key={tool.to}
              {...tool}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ToolGrid;
