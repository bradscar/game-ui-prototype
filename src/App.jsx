import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MobileFrame from './components/MobileFrame';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import HeroScreen from './screens/HeroScreen';
import SkillScreen from './screens/MapScreen';
import WorldMapScreen from './screens/WorldMapScreen';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  // FTUE state: 'play' -> 'skill-tab' -> 'upgrade' -> 'grinding' -> 'hero-tab' -> 'equip' -> 'complete'
  const [ftueStep, setFtueStep] = useState('play');
  const [runCount, setRunCount] = useState(0); // Track number of runs for gear unlock

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

  // Hero/Gear state
  const [inventory, setInventory] = useState([]);
  const [equipped, setEquipped] = useState({
    helmet: null,
    chest: null,
    boots: null,
    weapon: null,
    shield: null,
    ring: null,
  });
  const [pendingGear, setPendingGear] = useState(null); // Gear to add after animation

  // Imprints state - saved character snapshots
  const [imprints, setImprints] = useState([]);

  // Handle tab change with FTUE restrictions
  const handleTabChange = (tabId) => {
    // During FTUE, only allow specific tabs
    if (ftueStep === 'play') return;
    if (ftueStep === 'skill-tab' && tabId !== 'skill') return;
    if (ftueStep === 'upgrade' && tabId !== 'skill') return;
    if (ftueStep === 'grinding' && tabId === 'hero') return; // Hero still locked during grinding
    if (ftueStep === 'hero-tab' && tabId !== 'hero') return;
    if (ftueStep === 'equip' && tabId !== 'hero') return;
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
    runCount, setRunCount,
    pendingGear, setPendingGear,
    setActiveTab, // For navigating to hero tab after gear reward
    inventory, setInventory,
    equipped,
    imprints, setImprints,
  };

  // Render the active screen with props
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen {...progressProps} />;
      case 'skill':
        return <SkillScreen coins={coins} setCoins={setCoins} skills={skills} setSkills={setSkills} ftueStep={ftueStep} setFtueStep={setFtueStep} />;
      case 'hero':
        return <HeroScreen
          inventory={inventory}
          setInventory={setInventory}
          equipped={equipped}
          setEquipped={setEquipped}
          ftueStep={ftueStep}
          setFtueStep={setFtueStep}
          pendingGear={pendingGear}
          setPendingGear={setPendingGear}
        />;
      case 'map':
        return <WorldMapScreen />;
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

        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} ftueStep={ftueStep} coins={coins} skills={skills} />
      </div>
    </MobileFrame>
  );
}

export default App;
