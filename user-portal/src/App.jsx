import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Suspense, lazy, useState, useEffect } from 'react';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LiquidCursor from './components/animations/LiquidCursor';
import LoadingScreen from './components/animations/LoadingScreen';
import ChatWidget from './components/chatbot/ChatWidget';
import PageTransition from './components/animations/PageTransition';

// Lazy load pages for maximum performance (Vitals)
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const RequestTalent = lazy(() => import('./pages/RequestTalent'));
const SubmitCV = lazy(() => import('./pages/SubmitCV'));
const EngineeringServices = lazy(() => import('./pages/EngineeringServices'));
const Contact = lazy(() => import('./pages/Contact'));

function PageLoader() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-bg-page">
      <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin" />
    </div>
  );
}

export default function App() {
  const [revealApp, setRevealApp] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const location = useLocation();

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
      {/* Liquid Gooey Cursor */}
      <LiquidCursor />

      {/* Loading SVG Draw Screen */}
      {!loadingComplete && (
        <LoadingScreen 
          onReveal={() => setRevealApp(true)}
          onComplete={() => setLoadingComplete(true)} 
        />
      )}

      {/* Main Application Container - Rendered in background to eliminate flash of blank page loader */}
      <div 
        className="flex flex-col min-h-screen"
        style={{
          opacity: revealApp ? 1 : 0,
          visibility: revealApp ? 'visible' : 'hidden',
          transition: 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
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

