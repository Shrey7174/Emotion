import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; 

// --- Theme Configuration ---
const themeConfig = {
  NEUTRAL: {
    gradientFrom: 'from-gray-100',
    gradientTo: 'to-gray-200',
    text: 'text-gray-900',
    button: 'bg-indigo-600 hover:bg-indigo-700',
    accent: 'text-indigo-600',
    accentBg: 'bg-indigo-100',
    emoji: '😐',
  },
  POSITIVE: {
    gradientFrom: 'from-emerald-50',
    gradientTo: 'to-green-100',
    text: 'text-emerald-900',
    button: 'bg-emerald-600 hover:bg-emerald-700',
    accent: 'text-emerald-600',
    accentBg: 'bg-emerald-100',
    emoji: '😊',
  },
  NEGATIVE: {
    gradientFrom: 'from-rose-50',
    gradientTo: 'to-red-100',
    text: 'text-rose-900',
    button: 'bg-rose-600 hover:bg-rose-700',
    accent: 'text-rose-600',
    accentBg: 'bg-rose-100',
    emoji: '😠',
  },
};

// --- Animation Styles Component  ---
const AnimationStyles = () => (
  <style>
    {`
      @keyframes gradient-pan {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes sentiment-bounce {
        0% { transform: scale(0.9); opacity: 0; }
        70% { transform: scale(1.02); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes confetti-fall {
        0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
        100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
      }
      @keyframes lightning-flash {
        0%, 100% { opacity: 0; }
        5%, 15% { opacity: 1; background: white; }
        10%, 20% { opacity: 0; }
      }
      @keyframes sunny-day-fade-in {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      .animation-piece {
        position: fixed;
        top: -10vh;
        z-index: 100;
        animation: confetti-fall 5s linear forwards;
      }
      .lightning-flash {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        opacity: 0;
        z-index: 100;
        animation: lightning-flash 1.5s linear forwards;
        pointer-events: none;
      }
      .sunny-day-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: radial-gradient(circle at 50% -20%, rgba(253, 224, 71, 0.4) 0%, rgba(253, 224, 71, 0) 60%);
        z-index: 5;
        animation: sunny-day-fade-in 1.5s ease-out forwards;
        pointer-events: none;
      }
    `}
  </style>
);

// --- Sentiment Animation Component ---
const SentimentAnimation = ({ sentiment }) => {
  if (sentiment === 'POSITIVE') {
    return (
      <div className="animation-container">
        {Array.from({ length: 20 }).map((_, i) => {
          const style = {
            left: `${Math.random() * 100}vw`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
            backgroundColor: ['#fde047', '#f472b6', '#60a5fa'][Math.floor(Math.random() * 3)],
            width: '10px',
            height: '20px',
          };
          return <div key={i} className="animation-piece" style={style} />;
        })}
      </div>
    );
  }

  if (sentiment === 'NEGATIVE') {
    return (
      <>
        <div className="lightning-flash" />
      </>
    );
  }

  if (sentiment === 'NEUTRAL') {
    return <div className="sunny-day-overlay" />;
  }

  return null; 
};

// --- Microphone Icon Component ---
const MicrophoneIcon = ({ isListening }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`h-10 w-10 ${isListening ? 'animate-pulse text-red-400' : ''}`}
  >
    <path d="M12 1.75a3.25 3.25 0 0 0-3.25 3.25v7.5a3.25 3.25 0 0 0 6.5 0v-7.5A3.25 3.25 0 0 0 12 1.75Z" />
    <path d="M16.75 12.5a.75.75 0 0 0 1.5 0v-1.5a5.75 5.75 0 0 0-11.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5a4.25 4.25 0 0 1 8.5 0v1.5Z" />
    <path d="M12 15.25a.75.75 0 0 0 .75.75v3.14l1.65-1.65a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.65 1.65v-3.14a.75.75 0 0 0 .75-.75Z" />
  </svg>
);

const LandingPageStyles = () => (
  <style>
    {`
      /* Ensures the whole app uses Inter */
      .font-inter {
          font-family: 'Inter', sans-serif;
      }

      /* The fixed background grid, just like the video */
      .grid-bg {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          background-image:
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
          background-size: 40px 40px;
          z-index: -10; /* <--- FIX: Reverted to your original -10 */
      }

      /* The bold, all-caps hero text */
      .hero-text {
          font-size: clamp(3.5rem, 10vw, 8rem);
          font-weight: 900;
          letter-spacing: -0.05em;
          text-transform: uppercase;
          color: #111827;
          line-height: 1;
      }

      /* The "posters" that explain the project */
      .poster {
          background-color: #4f46e5; /* Indigo color */
          color: white;
          padding: 2rem;
          border-radius: 1rem;
          width: 100%; /* Posters are now full width on mobile */
          max-width: 380px; /* Max width for posters */
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          will-change: transform;
      }

      /* The floating emoji elements */
      .floating-emoji {
          position: absolute;
          font-size: clamp(6rem, 20vw, 15rem);
          z-index: 10;
          animation: float 6s ease-in-out infinite;
          will-change: transform;
      }

      /* The floating animation */
      @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
      }
    `}
  </style>
);

// --- NEW: Landing Page Component 
const LandingPage = ({ onNavigate }) => {

  useEffect(() => {
    const emojiPos = document.getElementById('emoji-positive');
    const emojiNeu = document.getElementById('emoji-neutral');
    const emojiNeg = document.getElementById('emoji-negative');

    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (emojiPos) emojiPos.style.transform = `translateY(${scrollY * 0.7}px)`;
      if (emojiNeu) emojiNeu.style.transform = `translateY(${scrollY * 1.2}px)`;
      if (emojiNeg) emojiNeg.style.transform = `translateY(${scrollY * 0.9}px)`;
    };

    window.addEventListener('scroll', handleScroll);

   
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); 

  return (
    <div className="relative text-gray-900">
      {/*  Background Grid */}
      <div className="grid-bg"></div>

     {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6 sm:p-8">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          {/* */}
          <div className="font-bold text-2xl sm:text-3xl tracking-wide uppercase">
            + Emotion UI
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com" // github link
              target="_blank" 
              rel="noopener noreferrer" 
              className="hidden sm:block px-6 py-2.5 text-base font-medium text-gray-700 hover:text-black transition-colors"
            >
              GitHub
            </a>
            {/**/}
            <button 
              onClick={() => onNavigate('app')}
              className="px-6 py-2.5 text-base font-medium text-white bg-gray-900 rounded-full hover:bg-gray-700 transition-colors shadow-lg"
            >
              Launch Demo
            </button>
          </div>
        </nav>
      </header>

      {/* Main Scrolling Content */}
      <main> {/**/ }
        
        {/* SECTION 1: Hero */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden px-4">
          <h1 className="hero-text text-center z-20">
            A UI That<br/>Actually Listens
          </h1>
          <div id="emoji-positive" className="floating-emoji hidden sm:block" style={{ top: '15%', left: '10%' }}>😊</div>
          <div id="emoji-neutral" className="floating-emoji hidden sm:block" style={{ top: '50%', left: '30%', animationDelay: '-2s' }}>😐</div>
          <div id="emoji-negative" className="floating-emoji hidden sm:block" style={{ top: '20%', right: '15%', animationDelay: '-4s' }}>😠</div>
        </section>

        {/* SECTION 2: Info Posters */}
        <section className="relative w-full max-w-7xl mx-auto py-24 sm:py-32 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-start">
            <div className="poster md:mt-24">
              <h2 className="text-3xl font-bold mb-4 uppercase">AI-Powered</h2>
              <p className="text-lg text-indigo-100">
                Using a HuggingFace model, the app analyzes your voice in real-time to detect sentiment.
              </p>
            </div>
            <div className="poster">
              <h2 className="text-3xl font-bold mb-4 uppercase">Dynamic UI</h2>
              <p className="text-lg text-indigo-100">
                The theme, colors, and animations all adapt instantly to reflect a positive, neutral, or negative mood.
              </p>
            </div>
            <div className="poster md:mt-40">
              <h2 className="text-3xl font-bold mb-4 uppercase">Full Stack</h2>
              <p className="text-lg text-indigo-100">
                Built with React on the frontend and a FastAPI (Python) server on the backend.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: Final CTA */}
        <section className="relative h-[80vh] flex flex-col items-center justify-center text-center px-4">
          <h2 className="hero-text z-20">
            React to<br/>Emotion.
          </h2>
          <p className="text-xl text-gray-600 mt-4 max-w-lg z-20">
            See the project in action. Speak, and watch the UI change right before your eyes.
          </p>
          {/* */}
          <button 
            onClick={() => onNavigate('app')}
            className="mt-8 px-10 py-4 text-lg font-medium text-white bg-gray-900 rounded-full hover:bg-gray-700 transition-colors shadow-xl z-20"
          >
            Launch The Demo
          </button>
        </section>

      </main>
    </div>
  );
};


// --- Sentiment Analyzer App Component 
const SentimentApp = ({ onNavigateBack }) => {
  const [transcript, setTranscript] = useState('');
  const [sentiment, setSentiment] = useState('NEUTRAL'); 
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const [animationTrigger, setAnimationTrigger] = useState(null); 
  const [isInitializing, setIsInitializing] = useState(true);

  const recognitionRef = useRef(null);
  const currentTheme = themeConfig[sentiment];

  // --- Speech Recognition Setup ---
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('SpeechRecognition API not found. (Requires Chrome/Edge or secure context https/localhost)');
      setError('Speech recognition is not supported in this browser.');
      setIsInitializing(false);
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
      getSentimentAnalysis(spokenText); 
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setError(`Error: ${event.error}`);
      setIsInitializing(false);
    };

    recognitionRef.current = recognition;
    setIsInitializing(false);
  }, []);

  // --- API Call: Get Sentiment (Using your REAL axios call) ---
  const getSentimentAnalysis = async (text) => {
    if (!text) return;

    try {
      
      setError(null); 
      
      const response = await axios.post(
        'http://13.201.192.81/analyze-sentiment/',
        { text }
      );
      
      const { label } = response.data;
      setSentiment(label);
      setAnimationTrigger(Date.now()); 

    } catch (err) {
      console.error('Error fetching sentiment:', err);
      if (err.response) {
        console.error("Server responded with:", err.response.data);
        setError(`Server error: ${err.response.status}`);
      } else if (err.request) {
        console.error("No response received:", err.request);
        setError('Could not connect to analysis server. (Is it running?)');
      } else {
        console.error('Error', err.message);
        setError('An unexpected error occurred.');
      }
      setSentiment('NEUTRAL');
    }
  };

  // --- Event Handler: Mic Button Click ---
  const handleMicClick = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition is not initialized.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setError(null);
      setSentiment('NEUTRAL'); 
      setAnimationTrigger(null); 
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Error starting recognition:", e);
        setError("Could not start listening. Please try again.");
      }
    }
  };

  // --- Render UI ---
  return (
    <div
      className={`
        flex min-h-screen w-full items-center justify-center p-4
        transition-colors duration-1000 ease-in-out
        bg-gradient-to-br ${currentTheme.gradientFrom} ${currentTheme.gradientTo}
        bg-[length:200%_200%] animate-[gradient-pan_10s_ease_infinite]
      `}
    >
      <AnimationStyles />
      {animationTrigger && (
        <SentimentAnimation 
          key={animationTrigger} 
          sentiment={sentiment} 
        />
      )}

      {/* Back button to return to landing page */}
      <button
        onClick={onNavigateBack}
        className="absolute top-4 left-4 z-20 rounded-full bg-white/70 p-2 text-gray-700 shadow-md transition-all hover:bg-white hover:scale-105"
        aria-label="Back to landing page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </button>

      <main
        className="
          w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8
          shadow-xl transition-all duration-300 relative z-10
        "
      >
        <div className="text-center">
          <h1 className={`text-3xl font-bold ${currentTheme.text}`}>
            Emotion UI Adapter
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Speak and watch the theme adapt to your mood.
          </p>
        </div>

        {/* --- Microphone Button --- */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleMicClick}
            disabled={!recognitionRef.current} 
            className={`
              relative flex h-28 w-28 items-center justify-center
              rounded-full text-white shadow-lg transition-all duration-200
              transform hover:scale-105 active:scale-95
              focus:outline-none focus:ring-4 focus:ring-opacity-50
              disabled:opacity-50 disabled:cursor-not-allowed
              ${currentTheme.button}
              ${
                isListening
                  ? `ring-4 ${currentTheme.accentBg} ring-opacity-75`
                  : `focus:ring-${currentTheme.button.replace('bg-', '')}-300`
              }
            `}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            <MicrophoneIcon isListening={isListening} />
          </button>
        </div>

        {/* --- Status & Transcript Display --- */}
        <div className="mt-8 min-h-[140px]">
          {isInitializing && (
            <div className="text-center text-gray-500 p-4">
              Initializing audio...
            </div>
          )}

          {!isInitializing && error && (
            <div className="rounded-lg bg-red-100 p-4 text-center">
              <p className="font-medium text-red-700">{error}</p>
            </div>
          )}

          {!isInitializing && !error && !recognitionRef.current && (
            <div className="rounded-lg bg-red-100 p-4 text-center">
              <p className="font-medium text-red-700">Speech recognition not supported in this browser.</p>
            </div>
          )}

          {!isInitializing && !error && recognitionRef.current && (
            <>
              <h2 className="text-lg font-semibold text-gray-700">
                {isListening ? 'Listening...' : 'Transcript'}
              </h2>
              <div
                className="mt-2 min-h-[80px] rounded-lg bg-gray-50 p-4"
              >
                <p
                  className={`text-lg font-medium ${
                    transcript ? 'text-gray-800' : 'text-gray-400'
                  }`}
                >
                  {transcript || (
                    <i>Click the mic to start...</i>
                  )}
                </p>
              </div>
            </>
          )}
        </div>

        {/* --- Detected Sentiment --- */}
        <div
          key={animationTrigger}
          className={`
            mt-6 flex items-center justify-center space-x-4
            rounded-lg p-4 transition-colors duration-300
            ${currentTheme.accentBg}
            ${animationTrigger ? 'animate-[sentiment-bounce_0.5s_ease-out]' : ''}
          `}
        >
          <span className="text-4xl">{currentTheme.emoji}</span>
          <div>
            <p
              className={`text-sm font-medium uppercase ${currentTheme.accent}`}
            >
              Detected Mood
            </p>
            <p className={`text-2xl font-bold ${currentTheme.text}`}>
              {sentiment}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
export default function App() {
  const [currentPage, setCurrentPage] = useState('landing'); 

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); 
  };

  const handleNavigateBack = () => {
    setCurrentPage('landing');
  };

  return (
    <div className="font-inter relative">
      
      {/* */}
      <LandingPageStyles />
      
      {/* Simple router logic */}
      {currentPage === 'landing' && (
        <LandingPage onNavigate={handleNavigate} />
      )}
      {currentPage === 'app' && (
        <SentimentApp onNavigateBack={handleNavigateBack} />
      )}
    </div>
  );
}