import { Link } from 'react-router-dom';
import ScrollReveal from '../../components/animations/ScrollReveal';
import Button from '../../components/ui/Button';
import FocusRingsBackground from '../../components/animations/FocusRingsBackground';

export default function CtaBanner() {
  return (
    <section className="w-full py-20 text-center relative overflow-hidden bg-transparent">
      
      {/* Soft Champagne Focus Rings Background */}
      <FocusRingsBackground />
      {/* Fade from previous section */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#E5E7EB] to-transparent pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center backdrop-blur-md rounded-3xl py-12 border border-purple-900/10 bg-white/40 shadow-xl">
        
        <ScrollReveal className="flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display leading-tight mb-6 text-purple-950">
            Ready to Build with Skilled Professionals?
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2} className="flex flex-wrap gap-4 justify-center">
          <Link to="/request-talent">
            <Button variant="filled"
                    className="!text-white !bg-purple-950 !border-purple-600 hover:!bg-purple-700 hover:!text-white hover:!border-purple-700">
              Request Talent
            </Button>
          </Link>
          <Link to="/submit-your-cv">
            <Button
              variant="outlined"
              className="!text-purple-950 !bg-white/60 !border-purple-900/20 hover:!bg-white hover:!text-purple-950 hover:!border-purple-600">
              Join the Network
            </Button>
          </Link>
        </ScrollReveal>

      </div>
    </section>
  );
}
