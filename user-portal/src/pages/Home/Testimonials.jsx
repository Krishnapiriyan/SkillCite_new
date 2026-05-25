import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollReveal from '../../components/animations/ScrollReveal';

export default function Testimonials() {
  const reviews = [
    { name: 'David Miller', role: 'VP of Engineering, Apex Build', text: 'SkillCite supplied five AutoCAD drafters and two structural estimators for our stadium build. The offline engineering service is outstanding!' },
    { name: 'Sarah Jenkins', role: 'HR Director, BuildGroup', text: 'Unlike modern automated platforms that send hundreds of unqualified resumes, SkillCite sent us three candidates, and we hired two of them. Manual screening works!' },
    { name: 'Mark Lin', role: 'Principal Architect, Lin Studio', text: 'I submitted my structural calculation requirements via their services form and got a complete stamped calculation package back in 3 days. Phenomenal offline service!' },
    { name: 'Elena Rostova', role: 'Engineering Lead, Core Infra', text: 'They truly understand engineering. The recruitment team asked technical questions that no other agency could answer. Highly recommended.' },
  ];

  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section >
       {/* className="w-full py-24 bg-bg-page border-b border-border overflow-hidden select-none"> */}
      {/* <div className="max-w-4xl mx-auto px-6 flex flex-col items-center"> */}
        
        {/* Header */}
        {/* <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-primary mb-4">
            Trusted by Builders & Engineers
          </h2>
          <p className="text-sm sm:text-base text-muted font-medium">
            Hear from leading developers and design professionals who utilize SkillCite.
          </p>
        </div> */}

        {/* Carousel Card */}
        <ScrollReveal className="w-full max-w-2xl relative">
          <div>
          {/* <div className="bg-surface border border-border p-8 sm:p-12 rounded-3xl shadow-lg relative flex flex-col items-center text-center"> */}
            
            {/* Stars */}
            {/* <div className="flex gap-1.5 text-yellow-400 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div> */}

            {/* Content with Animation */}
            {/* <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <p className="text-sm sm:text-lg text-primary/80 italic font-medium leading-relaxed mb-6">
                "{reviews[index].text}"
              </p>
              
              <span className="text-sm font-bold text-primary">
                {reviews[index].name}
              </span>
              <span className="text-xs text-muted font-semibold uppercase tracking-wider mt-1">
                {reviews[index].role}
              </span>
            </motion.div> */}

            {/* Navigation buttons */}
            {/* <div className="flex gap-4 mt-8">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-border bg-surface hover:bg-accent-light hover:text-accent text-primary transition-all flex items-center justify-center focus:outline-none"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-border bg-surface hover:bg-accent-light hover:text-accent text-primary transition-all flex items-center justify-center focus:outline-none"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div> */}

          </div>
        </ScrollReveal>

      {/* </div> */}
    </section>
  );
}
