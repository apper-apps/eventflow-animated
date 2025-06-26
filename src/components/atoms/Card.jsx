import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '',
  hover = false,
  padding = 'p-6',
  ...props 
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' } : {}}
      className={`bg-white rounded-card shadow-card ${padding} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;