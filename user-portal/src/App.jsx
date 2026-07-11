import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Suspense, lazy, useState, useEffect } from 'react';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/animations/LoadingScreen';
import ChatWidget from './components/chatbot/ChatWidget';
import PageTransition from './components/animations/PageTransition';

// Static Imports to prevent blank flash
import Home from './pages/Home';
import About from './pages/About';
import RequestTalent from './pages/RequestTalent';
import SubmitCV from './pages/SubmitCV';
import EngineeringServices from './pages/EngineeringServices';
import Contact from './pages/Contact';

// Lazy-loaded Pages (Commented out)
// const Home = lazy(() => import('./pages/Home'));
// const About = lazy(() => import('./pages/About'));
// const RequestTalent = lazy(() => import('./pages/RequestTalent'));
// const SubmitCV = lazy(() => import('./pages/SubmitCV'));
// const EngineeringServices = lazy(() => import('./pages/EngineeringServices'));
// const Contact = lazy(() => import('./pages/Contact'));

function PageLoader() {
  return null;
  /*
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FDFCF7] select-none">
      <div className="absolute w-72 h-72 rounded-full bg-cyan-200/10 blur-3xl animate-pulse" />
      <div className="flex flex-col items-center text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-cyan-600 mb-3">
          SkillCite
        </h1>
        <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">
          Your Trusted Recruitment Partner
        </p>
        <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/30">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-full origin-left animate-pulse" />
        </div>
      </div>
    </div>
  );
  */
}

export default function App() {
  const [revealApp, setRevealApp] = useState(true); // Changed from false to true to skip loading screen
  const [loadingComplete, setLoadingComplete] = useState(true); // Changed from false to true to skip loading screen
  const location = useLocation();

  // Reset scroll to top on every route transition (with Lenis compatibility)
  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }
  }, [location.pathname]);

  // Preload lazy components to make sure all page navigations are instant
  useEffect(() => {
    const preloadPages = async () => {
      try {
        await Promise.all([
          import('./pages/Home'),
          import('./pages/About'),
          import('./pages/RequestTalent'),
          import('./pages/SubmitCV'),
          import('./pages/EngineeringServices'),
          import('./pages/Contact')
        ]);
      } catch (err) {
        console.log("Preloading pages encountered an error:", err);
      }
    };
    preloadPages();
  }, []);

  return (
    <>
      {/* Loading SVG Draw Screen */}
      {/* 
      {!loadingComplete && (
        <LoadingScreen 
          onReveal={() => setRevealApp(true)}
          onComplete={() => setLoadingComplete(true)} 
        />
      )}
      */}

      {/* Main Application Container - Rendered in background to eliminate flash of blank page loader */}
      <div 
        className="flex flex-col min-h-screen"
        style={{
          opacity: revealApp ? 1 : 0,
          visibility: revealApp ? 'visible' : 'hidden',
          height: revealApp ? 'auto' : '100vh',
          overflow: revealApp ? 'visible' : 'hidden'
        }}
      >
        <Navbar />
        
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Suspense fallback={<PageLoader />}>
              <Routes location={location} key={location.pathname}>
                <Route 
                  path="/" 
                  element={
                    <PageTransition>
                      <Home />
                    </PageTransition>
                  } 
                />
                <Route 
                  path="/about" 
                  element={
                    <PageTransition>
                      <About />
                    </PageTransition>
                  } 
                />
                <Route 
                  path="/request-talent" 
                  element={
                    <PageTransition>
                      <RequestTalent />
                    </PageTransition>
                  } 
                />
                <Route 
                  path="/submit-your-cv" 
                  element={
                    <PageTransition>
                      <SubmitCV />
                    </PageTransition>
                  } 
                />
                <Route 
                  path="/engineering-services" 
                  element={
                    <PageTransition>
                      <EngineeringServices />
                    </PageTransition>
                  } 
                />
                <Route 
                  path="/contact" 
                  element={
                    <PageTransition>
                      <Contact />
                    </PageTransition>
                  } 
                />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </main>

        {/* Groq AI Float chatbot */}
        <ChatWidget />

        <Footer />
      </div>
    </>
  );
}

