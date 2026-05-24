import { Link } from 'react-router-dom';
import ScrollReveal from '../../components/animations/ScrollReveal';
import Button from '../../components/ui/Button';

export default function CtaBanner() {
  return (
    <section className="w-full py-20 bg-primary text-white text-center relative overflow-hidden select-none">
      
      {/* Background blobs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 rounded-full bg-accent/20 blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 rounded-full bg-accent/20 blur-[80px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center">
        
        <ScrollReveal className="flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display leading-tight mb-6">
            Ready to Build with Expert Engineers?
          </h2>
          <p className="text-sm sm:text-lg text-hint max-w-xl mb-8 leading-relaxed font-medium">
            Whether you want to submit your professional resume or request custom technical engineering calculations, our team is standing by.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2} className="flex flex-wrap gap-4 justify-center">
          <Link to="/request-talent">
            <Button variant="filled">
              Request Talent
            </Button>
          </Link>
          <Link to="/submit-your-cv">
            <Button
              variant="outlined"
              className="!text-slate-800 !bg-white !border-slate-300 hover:!bg-cyan-600 hover:!text-white hover:!border-cyan-600">
              Join the Network
            </Button>
          </Link>
        </ScrollReveal>

      </div>
    </section>
  );
}
