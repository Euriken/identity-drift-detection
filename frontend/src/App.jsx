import './index.css'
import Navbar from './components/Navbar.jsx'
import HeroSection from './components/HeroSection.jsx'
import LiveDemo from './components/LiveDemo.jsx'
import BenchmarkResults from './components/BenchmarkResults.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import AboutSection from './components/AboutSection.jsx'

function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy-950)' }}>
      <Navbar />
      <main>
        <HeroSection />
        <LiveDemo />
        <BenchmarkResults />
        <HowItWorks />
        <AboutSection />
      </main>
    </div>
  )
}

export default App
