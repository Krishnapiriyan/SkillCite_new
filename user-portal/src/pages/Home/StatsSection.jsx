import { useEffect, useState, useRef } from 'react';
import ScrollReveal from '../../components/animations/ScrollReveal';

function CountUp({ end, suffix = '', duration = 1500 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function StatsSection() {
  const stats = [
    { label: 'Successful Placements', val: <CountUp end={500} suffix="+" /> },
    { label: 'Client Retention Rate', val: <CountUp end={98} suffix="%" /> },
    { label: 'Technical Services Delivered', val: <CountUp end={1200} suffix="+" /> },
    { label: 'Form Review Time (Hours)', val: <CountUp end={24} /> },
  ];

  // return (
  //   <section className="w-full py-20 bg-accent text-white select-none">
  //     <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
  //       {stats.map((stat, idx) => (
  //         <ScrollReveal key={idx} delay={idx * 0.08} className="flex flex-col items-center">
  //           <span className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight mb-2">
  //             {stat.val}
  //           </span>
  //           <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-white/70">
  //             {stat.label}
  //           </span>
  //         </ScrollReveal>
  //       ))}
  //     </div>
  //   </section>
  // );
}
