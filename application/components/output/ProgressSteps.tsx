import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

const STEPS = [
  { label: 'Building your research brief', duration: 2500 },
  { label: 'Sending to AI model', duration: 7000 },
  { label: 'Synthesizing key findings', duration: 15000 },
  { label: 'Preparing your report', duration: 5000 },
];

interface ProgressStepsProps {
  topic: string;
  paperCount: number;
}

export function ProgressSteps({ topic, paperCount }: ProgressStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let step = 0;
    const advance = () => {
      if (step >= STEPS.length - 1) return;
      step++;
      setCurrentStep(step);
      setTimeout(advance, STEPS[step].duration);
    };
    const timer = setTimeout(advance, STEPS[0].duration);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-surface rounded-card shadow-soft-md border border-border p-8">
        {/* Header */}
        <div className="mb-7">
          <h3 className="font-serif text-lg font-semibold text-app-text mb-1">
            Synthesizing research
          </h3>
          <p className="text-xs text-app-text/45 font-sans">
            &ldquo;{topic}&rdquo; · {paperCount} paper{paperCount !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {STEPS.map((step, i) => {
            const isDone = i < currentStep;
            const isActive = i === currentStep;
            const isPending = i > currentStep;

            return (
              <AnimatePresence key={i}>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  {isDone && (
                    <CheckCircle2 size={18} className="text-primary shrink-0" />
                  )}
                  {isActive && (
                    <Loader2 size={18} className="text-interactive animate-spin shrink-0" />
                  )}
                  {isPending && (
                    <Circle size={18} className="text-app-text/20 shrink-0" />
                  )}
                  <span
                    className={`font-sans text-sm transition-colors duration-300 ${
                      isDone
                        ? 'text-app-text/50 line-through'
                        : isActive
                        ? 'text-app-text font-medium'
                        : 'text-app-text/30'
                    }`}
                  >
                    {step.label}
                  </span>
                </motion.div>
              </AnimatePresence>
            );
          })}
        </div>

        {/* Dots animation */}
        <div className="flex gap-1.5 mt-8 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary/50"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.22 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
