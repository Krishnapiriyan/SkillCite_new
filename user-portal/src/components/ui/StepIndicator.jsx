import { motion } from 'framer-motion';

export default function StepIndicator({ currentStep, totalSteps = 3, stepNames = [] }) {
  return (
    <div className="w-full flex flex-col gap-3 py-4 select-none">
      {/* Visual Bar */}
      <div className="relative w-full h-1.5 bg-border rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-accent rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep) / (totalSteps)) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </div>

      {/* Label and numbers */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-accent uppercase tracking-wider">
          Step {currentStep} of {totalSteps}
        </span>
        {stepNames.length > 0 && (
          <span className="font-medium text-muted">
            Next: {stepNames[currentStep] || 'Finish'}
          </span>
        )}
      </div>
      
      {/* Circle Nodes (Optional Desktop View) */}
      <div className="hidden sm:flex items-center justify-between mt-2 px-1 relative">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <div key={idx} className="flex flex-col items-center gap-1.5 relative z-10">
              <motion.div
                animate={{
                  backgroundColor: isCompleted || isActive ? '#2563EB' : '#FFFFFF',
                  borderColor: isCompleted || isActive ? '#2563EB' : '#E5E7EB',
                  scale: isActive ? 1.1 : 1
                }}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all
                  ${isCompleted || isActive ? 'text-white' : 'text-hint'}`}
              >
                {isCompleted ? '✓' : stepNum}
              </motion.div>
              {stepNames[idx] && (
                <span className={`text-[10px] font-semibold tracking-wider uppercase
                  ${isActive ? 'text-accent' : isCompleted ? 'text-primary/70' : 'text-hint'}`}
                >
                  {stepNames[idx]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
