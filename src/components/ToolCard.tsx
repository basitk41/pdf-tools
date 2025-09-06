import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface ToolCardProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  // Add variants prop for framer-motion staggered animation
  variants?: Variants;
}

const ToolCard = ({
  to,
  icon,
  title,
  description,
  variants,
}: ToolCardProps) => {
  return (
    <motion.div
      className='tool-card bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-center dark:bg-gray-800 dark:border-gray-700'
      variants={variants}
      whileHover={{
        scale: 1.05,
        boxShadow:
          '0 15px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        transition: { duration: 0.2 },
      }}
    >
      <Link to={to} className='block h-full'>
        <div className='bg-gradient-to-br from-blue-100 to-blue-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:from-blue-200 group-hover:to-blue-300'>
          {icon}
        </div>
        <h3 className='font-semibold text-gray-800 dark:text-white'>{title}</h3>
        <p className='text-sm text-gray-600 mt-2 dark:text-gray-400'>
          {description}
        </p>
      </Link>
    </motion.div>
  );
};

export default ToolCard;
