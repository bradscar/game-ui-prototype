import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MobileFrame from './components/MobileFrame';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import SkillScreen from './screens/MapScreen';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  // FTUE state: 'play' -> 'skill-tab' -> 'upgrade' -> 'complete'
  const [ftueStep, setFtueStep] = useState('play');

  // Currency state (lifted from HomeScreen)
  const [coins, setCoins] = useState(0);
  const [energy, setEnergy] = useState(500);
  const [gems, setGems] = useState(0);

  // Progress state (lifted from HomeScreen)
  const [survivedDays, setSurvivedDays] = useState(0);
  const [currentAct, setCurrentAct] = useState(1);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [readyForNextAct, setReadyForNextAct] = useState(false);
  const [lastRunSkillLevels, setLastRunSkillLevels] = useState(0); // Track skills at last run for variance

  // Skills state - 0 means locked, 1+ means level
  const [skills, setSkills] = useState({
    attack: 0,
    hp: 0,
    defense: 0,
    speed: 0,
    critRate: 0,
    critDamage: 0,
    luck: 0,
    dodge: 0,
    armor: 0,
  });

  // Handle tab change with FTUE restrictions
  const handleTabChange = (tabId) => {
    // During FTUE, only allow specific tabs
    if (ftueStep === 'skill-tab' && tabId !== 'skill') return;
    if (ftueStep === 'play') return; // Can't change tabs during play step
    if (ftueStep === 'upgrade' && tabId !== 'skill') return;
    setActiveTab(tabId);
  };

  // Progress props bundle for HomeScreen
  const progressProps = {
    coins, setCoins,
    energy, setEnergy,
    gems, setGems,
    survivedDays, setSurvivedDays,
    currentAct, setCurrentAct,
    carouselIndex, setCarouselIndex,
    readyForNextAct, setReadyForNextAct,
    ftueStep, setFtueStep,
    skills, // Pass skills for progression calculation
    lastRunSkillLevels, setLastRunSkillLevels,
  };

  // Render the active screen with props
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen {...progressProps} />;
      case 'skill':
        return <SkillScreen coins={coins} setCoins={setCoins} skills={skills} setSkills={setSkills} ftueStep={ftueStep} setFtueStep={setFtueStep} />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen {...progressProps} />;
    }
  };

  return (
    <MobileFrame>
      <div className="relative w-full h-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 no-select">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>

        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} ftueStep={ftueStep} />
      </div>
    </MobileFrame>
  );
}

export default App;
