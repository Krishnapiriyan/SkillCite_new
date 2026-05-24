import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Button from './Button';

export default function SuccessScreen({ 
  title = 'Submission Successful', 
  message = 'Thank you for contacting SkillCite. Our team personally reviews all requirements and will be in touch with you shortly.',
  onBack 
}) {
  return (
    <div className="w-full max-w-lg mx-auto py-12 px-6 flex flex-col items-center justify-center text-center">
      {/* Animated Checkbox Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: 'spring', 
          stiffness: 150, 
          damping: 15,
          delay: 0.1 
        }}
        className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-accent mb-6"
      >
        <CheckCircle2 className="w-10 h-10 stroke-[2]" />
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl sm:text-3xl font-bold text-primary mb-4"
      >
        {title}
      </motion.h2>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-sm sm:text-base text-muted mb-8 leading-relaxed max-w-md"
      >
        {message}
      </motion.p>

      {/* Action Button */}
      {onBack && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            onClick={onBack} 
            variant="outlined" 
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Portal
          </Button>
        </motion.div>
      )}
    </div>
  );
}
