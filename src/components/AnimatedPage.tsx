import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedPageProps {
    children: ReactNode;
}

const AnimatedPage = ({ children }: AnimatedPageProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedPage; 