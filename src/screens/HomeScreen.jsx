import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Coins, Gem, User, Box, X, Shield, Sword, Star, Heart, Flame, Skull, Crown, Diamond, Moon, Sun, Sparkles, Target, Info } from 'lucide-react';

// Act names based on Odysseus' journey
const actNames = [
  'Ismaros',      // 1 - City of the Cicones
  'Lotophagi',    // 2 - Land of Lotus Eaters
  'Polyphemus',   // 3 - Cyclops cave
  'Aeolia',       // 4 - Island of winds
  'Laestrygonia', // 5 - Giant cannibals
  'Aeaea',        // 6 - Circe's island
  'Erebus',       // 7 - The underworld
  'Anthemoessa',  // 8 - Island of Sirens
  'Scylla',       // 9 - Six-headed monster
  'Charybdis',    // 10 - The whirlpool
  'Thrinacia',    // 11 - Helios' cattle
  'Ogygia',       // 12 - Calypso's island
  'Scheria',      // 13 - Phaeacian land
  'Asteris',      // 14 - Ambush island
  'Cephalonia',   // 15 - Neighboring isle
  'Neritos',      // 16 - Mountain of Ithaca
  'Dulichium',    // 17 - Allied island
  'Zacynthus',    // 18 - Southern isle
  'Pylos',        // 19 - Nestor's kingdom
  'Sparta',       // 20 - Menelaus' realm
  'Mycenae',      // 21 - Agamemnon's city
  'Argolis',      // 22 - Ancient region
  'Olympus',      // 23 - Home of gods
  'Elysium',      // 24 - Paradise fields
  'Ithaca',       // 25 - Home at last
];

// Act descriptions/subheadings
const actDescriptions = [
  'City of the Cicones',
  'Land of the Lotus Eaters',
  'Lair of the Cyclops',
  'Island of the Winds',
  'Land of the Giants',
  "Circe's Enchanted Isle",
  'Realm of the Dead',
  'Island of the Sirens',
  'Den of the Six-Headed Beast',
  'The Deadly Whirlpool',
  "Helios' Sacred Pastures",
  "Calypso's Hidden Paradise",
  'Land of the Phaeacians',
  'The Ambush Straits',
  'The Neighboring Shore',
  'The Sacred Mountain',
  'Isle of the Allies',
  'The Southern Waters',
  "Nestor's Ancient Kingdom",
  "Menelaus' Golden Realm",
  "Agamemnon's Cursed City",
  'The Ancient Heartland',
  'Throne of the Gods',
  'Fields of the Blessed',
  'Home at Last',
];

// Generate all milestone boxes: 5, 10, 15, 20, 25 days for each act (1-25)
const allDays = [];
for (let act = 1; act <= 25; act++) {
  for (let days of [5, 10, 15, 20, 25]) {
    allDays.push({ days, act });
  }
}

function DaysCarousel({ centerIndex, survivedDays, currentAct }) {
  const SMALL = 100;
  const LARGE = 130;
  const GAP = 20;
  const OFFSET = SMALL + GAP + (LARGE - SMALL) / 2;

  return (
    <div className="relative overflow-hidden" style={{ marginTop: '48px', height: '150px' }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {allDays.map((item, index) => {
            const diff = index - centerIndex;
            if (Math.abs(diff) > 1) return null;

            const isCenter = diff === 0;
            const size = isCenter ? LARGE : SMALL;
            const xPos = diff * OFFSET;

            // Check if this milestone is unlocked
            // Previous acts - all unlocked, Current act - check if days reached
            const isUnlocked = item.act < currentAct || (item.act === currentAct && survivedDays >= item.days);
            const isCurrentAct = item.act === currentAct;
            const isPreviousAct = item.act < currentAct;

            return (
              <motion.div
                key={`${item.act}-${item.days}`}
                initial={{ x: diff > 0 ? 300 : -300, opacity: 0, width: SMALL, height: SMALL }}
                animate={{
                  x: xPos,
                  opacity: isCenter ? 1 : 0.5,
                  width: size,
                  height: size
                }}
                exit={{ x: diff >= 0 ? -300 : 300, opacity: 0, width: SMALL, height: SMALL }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className={`absolute border rounded-lg flex flex-col items-center justify-center ${
                  isUnlocked
                    ? 'bg-green-800/50 border-green-500'
                    : isCurrentAct
                      ? 'bg-slate-800 border-slate-600'
                      : 'bg-slate-800/50 border-slate-700'
                }`}
              >
                <span className={`font-bold ${isCenter ? 'text-lg' : 'text-sm'} ${
                  isUnlocked ? 'text-green-300' : isCurrentAct ? 'text-white' : 'text-slate-500'
                }`}>
                  {item.days} Days
                </span>
                <span className={`${isCenter ? 'text-sm' : 'text-xs'} ${
                  isUnlocked ? 'text-green-400/70' : isCurrentAct ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Act {item.act}
                </span>
                {isUnlocked && isCenter && (
                  <span className="text-xs text-green-400 mt-1">Ready!</span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FlyingReward({ type, delay, startX, startY, endX, endY = 30, onComplete }) {
  const icons = {
    coin: { Icon: Coins, color: 'text-yellow-400' },
    gem: { Icon: Gem, color: 'text-purple-400' },
    energy: { Icon: Zap, color: 'text-amber-400' },
    gear: { Icon: Sword, color: 'text-green-400' },
  };
  const { Icon, color } = icons[type];

  return (
    <motion.div
      className={`absolute ${color}`}
      style={{ zIndex: 100 }}
      initial={{ y: startY, x: startX, scale: 1, opacity: 1 }}
      animate={{ y: endY, x: endX, scale: 0.5, opacity: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
    >
      <Icon size={24} fill="currentColor" />
    </motion.div>
  );
}

// Gear definitions for random drops
const gearTypes = [
  { slot: 'weapon', name: 'Iron Sword' },
  { slot: 'shield', name: 'Iron Shield' },
  { slot: 'helmet', name: 'Iron Helm' },
  { slot: 'chest', name: 'Iron Armor' },
  { slot: 'boots', name: 'Iron Boots' },
  { slot: 'ring', name: 'Iron Ring' },
];

export default function HomeScreen({
  coins, setCoins,
  energy, setEnergy,
  gems, setGems,
  survivedDays, setSurvivedDays,
  currentAct, setCurrentAct,
  carouselIndex, setCarouselIndex,
  readyForNextAct, setReadyForNextAct,
  ftueStep, setFtueStep,
  skills,
  lastRunSkillLevels, setLastRunSkillLevels,
  runCount, setRunCount,
  pendingGear, setPendingGear,
  setActiveTab,
  inventory, setInventory,
  equipped,
  imprints, setImprints,
}) {
  // Calculate total skill levels for progression
  const totalSkillLevels = Object.values(skills).reduce((sum, level) => sum + level, 0);
  const hasUpgraded = totalSkillLevels > lastRunSkillLevels;
  // Local UI state (doesn't need to persist across tab switches)
  const [chestOpen, setChestOpen] = useState(false);
  const [particles, setParticles] = useState([]);
  const [actCompleteOpen, setActCompleteOpen] = useState(false);
  const [actIntroOpen, setActIntroOpen] = useState(false);
  const [actIntroShown, setActIntroShown] = useState(false);
  const [actIntroFromPlay, setActIntroFromPlay] = useState(false); // true = show Start button
  const [gameplayOpen, setGameplayOpen] = useState(false);
  const [gameResult, setGameResult] = useState(null); // { victory: bool, days: number }
  const [droppedGear, setDroppedGear] = useState(null); // Gear dropped this run

  // FTUE: Check if we're in a restricted state
  const isFtuePlay = ftueStep === 'play';
  const isFtueSkillTab = ftueStep === 'skill-tab';
  const isFtueHeroTab = ftueStep === 'hero-tab';
  const isPlayDisabled = isFtueSkillTab || isFtueHeroTab;
  const isFtueRestricted = ftueStep !== 'complete' && ftueStep !== 'grinding';
  const isChestDisabled = ftueStep === 'play' || ftueStep === 'skill-tab' || ftueStep === 'upgrade';

  // Get current milestone and check if it can be claimed
  const currentMilestone = allDays[carouselIndex];
  const canClaim = currentMilestone && (
    // Previous acts - all milestones are claimable
    currentMilestone.act < currentAct ||
    // Current act - only if we've reached the day threshold
    (currentMilestone.act === currentAct && survivedDays >= currentMilestone.days)
  );

  const handlePlay = () => {
    // Show intro popup on first play of each act (skip Act 1)
    if (currentAct > 1 && survivedDays === 0 && !actIntroShown) {
      setActIntroOpen(true);
      setActIntroFromPlay(true);
      setActIntroShown(true);
      return;
    }

    // Deduct energy cost and open gameplay screen
    setEnergy(e => e - 5);
    setGameplayOpen(true);
  };

  const handleGameplayComplete = () => {
    // Progression formula: maxDays = 3 + (totalSkillLevels * 2), capped at 25
    const maxDays = Math.min(25, 3 + (totalSkillLevels * 2));

    let resultDays;

    if (hasUpgraded || survivedDays === 0) {
      // First run or upgraded since last run: guaranteed progress to max
      resultDays = maxDays;
    } else {
      // No upgrade: variance of ±2 days from last result
      const variance = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, +1, or +2
      resultDays = Math.max(1, Math.min(maxDays, survivedDays + variance));
    }

    if (resultDays >= 25) {
      // Victory - beat the act
      setGameResult({ victory: true, days: 25 });
    } else {
      // Defeat - show how far you got
      setGameResult({ victory: false, days: resultDays });
    }

    // Roll for gear drop (33% chance after FTUE complete)
    if (ftueStep === 'complete' && Math.random() < 0.33) {
      const randomGear = gearTypes[Math.floor(Math.random() * gearTypes.length)];
      setDroppedGear({
        id: Date.now(),
        slot: randomGear.slot,
        name: randomGear.name,
        rarity: 'uncommon', // Green rarity
      });
    } else {
      setDroppedGear(null);
    }
  };

  const handleResultDismiss = () => {
    const is4thRun = ftueStep === 'grinding' && runCount === 3;

    // Spawn coin animation from center of screen to top HUD
    const newParticles = [];
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: `coin-${Date.now()}-${i}`,
        type: 'coin',
        delay: i * 0.04,
        startX: 195 + (Math.random() - 0.5) * 30,
        startY: 380 + (Math.random() - 0.5) * 20,
        endX: 220,
      });
    }

    // On 4th run during grinding, add gear flying to Hero tab (bottom left)
    if (is4thRun) {
      newParticles.push({
        id: `gear-${Date.now()}`,
        type: 'gear',
        delay: 0.3,
        startX: 230, // Near the gear icon in rewards
        startY: 380,
        endX: 50, // Hero tab position (left side of bottom nav)
        endY: 750, // Bottom of screen where nav is
      });
    }

    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1200);

    // Add coins after animation
    setTimeout(() => {
      setCoins(c => c + 100);
    }, 500);

    // FTUE: After first run, advance to skill-tab step
    if (ftueStep === 'play') {
      setTimeout(() => {
        setFtueStep('skill-tab');
      }, 800); // After coin animation completes
    }

    // FTUE: On 4th run during grinding, set pending gear and advance to hero-tab
    if (is4thRun) {
      // Create the gear item
      const newGear = {
        id: Date.now(),
        slot: 'weapon',
        name: 'Bronze Sword',
        rarity: 'uncommon',
      };
      setPendingGear(newGear);

      setTimeout(() => {
        setFtueStep('hero-tab');
      }, 900); // After gear animation reaches the tab
    }

    // Increment run count during grinding phase
    if (ftueStep === 'grinding') {
      setRunCount(c => c + 1);
    }

    // Add dropped gear to inventory (after FTUE complete)
    if (droppedGear) {
      setTimeout(() => {
        setInventory(prev => [...prev, droppedGear]);
        setDroppedGear(null);
      }, 500);
    }

    // Track skill levels at this run for variance calculation
    setLastRunSkillLevels(totalSkillLevels);

    if (gameResult.victory) {
      const completedAct = currentAct;
      // Advance to next act immediately
      setCurrentAct(prev => prev + 1);
      setSurvivedDays(0);
      setActIntroShown(false);
      // Only show imprint popup after completing Act 2
      if (completedAct === 2) {
        setTimeout(() => {
          setActCompleteOpen(true); // Show imprint popup
        }, 600);
      }
    } else {
      setSurvivedDays(gameResult.days);
    }
    setGameResult(null);
    setGameplayOpen(false);
  };

  const spawnFlyingRewards = (startY, centerX) => {
    const newParticles = [];

    // Coins - left icon
    for (let i = 0; i < 5; i++) {
      newParticles.push({
        id: `coin-${Date.now()}-${i}`,
        type: 'coin',
        delay: i * 0.05,
        startX: centerX - 70 + (Math.random() - 0.5) * 20,
        startY: startY + (Math.random() - 0.5) * 20,
        endX: 220,
      });
    }

    // Gems - middle icon
    for (let i = 0; i < 4; i++) {
      newParticles.push({
        id: `gem-${Date.now()}-${i}`,
        type: 'gem',
        delay: i * 0.05 + 0.1,
        startX: centerX + (Math.random() - 0.5) * 20,
        startY: startY + (Math.random() - 0.5) * 20,
        endX: 320,
      });
    }

    // Energy - right icon
    for (let i = 0; i < 3; i++) {
      newParticles.push({
        id: `energy-${Date.now()}-${i}`,
        type: 'energy',
        delay: i * 0.05 + 0.15,
        startX: centerX + 70 + (Math.random() - 0.5) * 20,
        startY: startY + (Math.random() - 0.5) * 20,
        endX: 120,
      });
    }

    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1000);
  };

  const handleClaim = () => {
    if (!canClaim) return;

    // Advance carousel to next milestone
    if (carouselIndex < allDays.length - 1) {
      setCarouselIndex(carouselIndex + 1);
    }
    // Chest panel rewards are near bottom of screen
    spawnFlyingRewards(420, 195);

    // Add rewards after animation
    setTimeout(() => {
      setEnergy(e => e + 15);
      setCoins(c => c + 200);
      setGems(g => g + 50);
    }, 600);
  };

  const handleImprint = () => {
    // Save character state as imprint (save previous act number since we already advanced)
    const newImprint = {
      id: Date.now(),
      number: imprints.length + 1,
      skills: { ...skills },
      equipped: { ...equipped },
      inventory: [...inventory],
      act: currentAct - 1, // The act we just completed
      createdAt: new Date().toISOString(),
    };
    setImprints(prev => [...prev, newImprint]);

    // Close popup
    setActCompleteOpen(false);
  };

  return (
    <div className="relative w-full h-full">
      {/* ===== FLYING PARTICLES (always on top) ===== */}
      {particles.map((p) => (
        <FlyingReward key={p.id} {...p} />
      ))}

      {/* ===== TOP HUD ===== */}
      <div className={`absolute top-4 left-6 right-6 flex items-center gap-3 ${isFtuePlay ? 'opacity-50' : ''}`}>
        <div className="w-12 h-12 rounded-xl bg-slate-700 border-2 border-slate-500 flex items-center justify-center shrink-0">
          <User size={24} className="text-slate-300" />
        </div>
        <div className="flex-1 flex items-center justify-end gap-2">
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-lg" style={{ padding: '12px 20px' }}>
            <Zap size={16} className="text-amber-400" fill="currentColor" />
            <span className="text-white text-sm font-bold">{energy}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-lg" style={{ padding: '12px 20px' }}>
            <Coins size={16} className="text-yellow-400" />
            <span className="text-white text-sm font-bold">{coins}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-lg" style={{ padding: '12px 20px' }}>
            <Gem size={16} className="text-purple-400" fill="currentColor" />
            <span className="text-white text-sm font-bold">{gems}</span>
          </div>
        </div>
      </div>

      {/* ===== ACT TITLE ===== */}
      <div className={`absolute top-28 left-0 right-0 flex flex-col items-center ${isFtueRestricted ? 'opacity-50' : ''}`}>
        <div className="flex items-center gap-2">
          <h1 className="text-white text-2xl font-bold tracking-wide">ACT {currentAct} - {actNames[currentAct - 1]}</h1>
          <motion.button
            onClick={() => {
              if (isFtueRestricted) return;
              setActIntroFromPlay(false);
              setActIntroOpen(true);
            }}
            whileHover={!isFtueRestricted ? { scale: 1.1 } : {}}
            whileTap={!isFtueRestricted ? { scale: 0.9 } : {}}
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isFtueRestricted
                ? 'bg-slate-800 border border-slate-700 cursor-not-allowed'
                : 'bg-slate-700 border border-slate-500'
            }`}
          >
            <Info size={14} className={isFtueRestricted ? 'text-slate-600' : 'text-slate-300'} />
          </motion.button>
        </div>
        <p className="text-slate-400 text-sm mt-1">Longest Survived: {survivedDays} Days</p>
      </div>

      {/* ===== CHEST ===== */}
      <div className="absolute bottom-56 left-0 right-0 flex justify-center">
        <motion.button
          onClick={() => !isChestDisabled && canClaim && setChestOpen(true)}
          whileHover={!isChestDisabled && canClaim ? { scale: 1.05 } : {}}
          whileTap={!isChestDisabled && canClaim ? { scale: 0.95 } : {}}
          className={`relative w-20 h-16 rounded-lg border-2 flex items-center justify-center ${
            isChestDisabled || !canClaim
              ? 'bg-gradient-to-b from-slate-600 to-slate-700 border-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-b from-amber-600 to-amber-800 border-amber-500'
          }`}
        >
          <Box size={32} className={isChestDisabled || !canClaim ? 'text-slate-500' : 'text-amber-300'} />
          {canClaim && !isChestDisabled && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900" />
          )}
        </motion.button>
      </div>

      {/* ===== PLAY BUTTON ===== */}
      <div className="absolute bottom-32 left-0 right-0 flex justify-center">
        <motion.button
          className="relative group"
          whileHover={energy >= 5 && !isPlayDisabled ? { scale: 1.05 } : {}}
          whileTap={energy >= 5 && !isPlayDisabled ? { scale: 0.95 } : {}}
          onClick={energy >= 5 && !isPlayDisabled ? handlePlay : undefined}
          style={{ cursor: energy >= 5 && !isPlayDisabled ? 'pointer' : 'not-allowed' }}
        >
          <div className={`absolute -inset-4 rounded-lg blur-xl ${energy >= 5 && !isPlayDisabled ? 'bg-green-400/25' : 'bg-slate-400/10'}`} />
          <div className={`absolute inset-0 translate-y-1.5 rounded-lg ${energy >= 5 && !isPlayDisabled ? 'bg-green-700' : 'bg-slate-700'}`} />
          <div className={`relative flex items-center justify-center gap-3 font-bold w-60 h-16 rounded-lg border-t ${
            energy >= 5 && !isPlayDisabled
              ? 'bg-gradient-to-b from-green-400 to-green-500 text-white border-green-300/40'
              : 'bg-gradient-to-b from-slate-500 to-slate-600 text-slate-300 border-slate-400/40'
          }`}>
            <span className="text-2xl tracking-wider drop-shadow">PLAY</span>
            <div className={`flex items-center gap-1 rounded-md px-2 py-1 ${energy >= 5 && !isPlayDisabled ? 'bg-green-600/50' : 'bg-slate-600/50'}`}>
              <span className="text-sm font-bold">5</span>
              <Zap size={14} className={energy >= 5 && !isPlayDisabled ? 'text-amber-300' : 'text-slate-400'} fill="currentColor" />
            </div>
          </div>
        </motion.button>
      </div>

      {/* ===== GAMEPLAY SCREEN ===== */}
      <AnimatePresence>
        {gameplayOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900 z-50 flex flex-col"
          >
            {gameResult ? (
              <>
                {/* Result Screen */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  <h1 className={`text-4xl font-bold mb-4 ${gameResult.victory ? 'text-amber-400' : 'text-red-400'}`}>
                    {gameResult.victory ? 'VICTORY' : 'DEFEAT'}
                  </h1>
                  <p className="text-slate-300 text-lg">Days Survived: {gameResult.days}</p>

                  {/* Rewards Section */}
                  <div style={{ marginTop: '32px' }}>
                    <p className="text-slate-300 text-xs font-semibold uppercase tracking-wider text-center" style={{ marginBottom: '12px' }}>Rewards</p>
                    <div className="flex justify-center gap-3">
                      <div className="w-14 h-14 bg-yellow-900/60 border border-yellow-500 rounded-lg flex items-center justify-center">
                        <Coins size={24} className="text-yellow-400" />
                      </div>
                      {/* Show gear reward on 4th run (FTUE) */}
                      {runCount === 3 && ftueStep === 'grinding' && (
                        <div className="w-14 h-14 bg-green-900/60 border border-green-500 rounded-lg flex items-center justify-center">
                          <Sword size={24} className="text-green-400" />
                        </div>
                      )}
                      {/* Show random gear drop (33% chance after FTUE) */}
                      {droppedGear && (
                        <div className="w-14 h-14 bg-green-900/60 border border-green-500 rounded-lg flex items-center justify-center">
                          <Sword size={24} className="text-green-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Claim Button */}
                  <div className="flex justify-center" style={{ marginTop: '32px' }}>
                    <motion.button
                      className="relative group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResultDismiss}
                    >
                      <div className="absolute -inset-2 bg-green-400/25 rounded-lg blur-xl" />
                      <div className="absolute inset-0 translate-y-1 bg-green-700 rounded-lg" />
                      <div className="relative flex items-center justify-center bg-gradient-to-b from-green-400 to-green-500 text-white font-bold rounded-lg border-t border-green-300/40" style={{ width: '140px', height: '42px' }}>
                        <span className="text-lg tracking-wider drop-shadow">CLAIM</span>
                      </div>
                    </motion.button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Header */}
                <div className="pt-12 px-6">
                  <h1 className="text-white text-2xl font-bold text-center">Core Mechanic</h1>
                  <p className="text-slate-400 text-center mt-2">Day {survivedDays + 1}</p>
                </div>

                {/* Content area */}
                <div className="flex-1 flex items-center justify-center">
                  <motion.button
                    className="relative group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGameplayComplete}
                  >
                    <div className="absolute -inset-2 bg-green-400/25 rounded-lg blur-xl" />
                    <div className="absolute inset-0 translate-y-1 bg-green-700 rounded-lg" />
                    <div className="relative flex items-center justify-center bg-gradient-to-b from-green-400 to-green-500 text-white font-bold rounded-lg border-t border-green-300/40" style={{ width: '180px', height: '48px' }}>
                      <span className="text-lg tracking-wider drop-shadow">SIMULATE RUN</span>
                    </div>
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== ACT INTRO POPUP ===== */}
      <AnimatePresence>
        {actIntroOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-50"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Popup */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative bg-slate-800 border border-slate-600 rounded-2xl"
              style={{ width: '300px', padding: '24px' }}
            >
              {/* Exit button */}
              <motion.button
                onClick={() => setActIntroOpen(false)}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 w-7 h-7 bg-slate-700 border border-slate-600 rounded-lg flex items-center justify-center"
              >
                <X size={14} className="text-white" />
              </motion.button>

              {/* Title */}
              <h2 className="text-amber-400 text-xl font-bold text-center" style={{ marginTop: '8px' }}>
                Act {currentAct} - {actNames[currentAct - 1]}
              </h2>
              <p className="text-slate-400 text-sm text-center" style={{ marginTop: '6px' }}>
                {actDescriptions[currentAct - 1]}
              </p>

              {/* Runes */}
              <div style={{ marginTop: '24px' }}>
                <p className="text-slate-300 text-xs font-semibold uppercase tracking-wider" style={{ marginBottom: '10px' }}>{actIntroFromPlay ? 'New Runes' : 'Runes'}</p>
                <div className="flex justify-between">
                  <div className="w-11 h-11 bg-slate-700/80 border border-slate-600 rounded-lg flex items-center justify-center">
                    <Flame size={20} className="text-orange-400" />
                  </div>
                  <div className="w-11 h-11 bg-slate-700/80 border border-slate-600 rounded-lg flex items-center justify-center">
                    <Shield size={20} className="text-blue-400" />
                  </div>
                  <div className="w-11 h-11 bg-slate-700/80 border border-slate-600 rounded-lg flex items-center justify-center">
                    <Moon size={20} className="text-indigo-400" />
                  </div>
                  <div className="w-11 h-11 bg-slate-700/80 border border-slate-600 rounded-lg flex items-center justify-center">
                    <Star size={20} className="text-yellow-400" />
                  </div>
                  <div className="w-11 h-11 bg-slate-700/80 border border-slate-600 rounded-lg flex items-center justify-center">
                    <Sparkles size={20} className="text-cyan-400" />
                  </div>
                </div>
              </div>

              {/* Relics */}
              <div style={{ marginTop: '20px' }}>
                <p className="text-slate-300 text-xs font-semibold uppercase tracking-wider" style={{ marginBottom: '10px' }}>{actIntroFromPlay ? 'New Relics' : 'Relics'}</p>
                <div className="flex gap-3">
                  <div className="w-11 h-11 bg-slate-700/80 border border-slate-600 rounded-lg flex items-center justify-center">
                    <Crown size={20} className="text-amber-400" />
                  </div>
                  <div className="w-11 h-11 bg-slate-700/80 border border-slate-600 rounded-lg flex items-center justify-center">
                    <Diamond size={20} className="text-purple-400" />
                  </div>
                </div>
              </div>

              {/* Possible Loot */}
              <div style={{ marginTop: '20px' }}>
                <p className="text-slate-300 text-xs font-semibold uppercase tracking-wider" style={{ marginBottom: '10px' }}>Possible Loot</p>
                <div className="flex justify-between">
                  <div className="w-11 h-11 bg-slate-700/80 border border-slate-600 rounded-lg flex items-center justify-center">
                    <Coins size={20} className="text-yellow-400" />
                  </div>
                  <div className="w-11 h-11 bg-slate-700/80 border border-slate-600 rounded-lg flex items-center justify-center">
                    <Gem size={20} className="text-purple-400" />
                  </div>
                  <div className="w-11 h-11 bg-slate-700/80 border border-slate-600 rounded-lg flex items-center justify-center">
                    <Sword size={20} className="text-slate-300" />
                  </div>
                  <div className="w-11 h-11 bg-slate-700/80 border border-slate-600 rounded-lg flex items-center justify-center">
                    <Heart size={20} className="text-red-400" />
                  </div>
                  <div className="w-11 h-11 bg-slate-700/80 border border-slate-600 rounded-lg flex items-center justify-center">
                    <Skull size={20} className="text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Start Button - only show when opened from play */}
              {actIntroFromPlay && (
                <div className="flex justify-center" style={{ marginTop: '28px' }}>
                  <motion.button
                    className="relative group"
                    whileHover={energy >= 5 ? { scale: 1.05 } : {}}
                    whileTap={energy >= 5 ? { scale: 0.95 } : {}}
                    onClick={energy >= 5 ? () => {
                      setActIntroOpen(false);
                      // Deduct energy cost
                      setEnergy(e => e - 5);
                      // Simulate play action
                      const increment = Math.floor(Math.random() * 4) + 1;
                      const newDays = survivedDays + increment;
                      if (newDays >= 25) {
                        setActCompleteOpen(true);
                      } else {
                        setSurvivedDays(newDays);
                      }
                    } : undefined}
                    style={{ cursor: energy >= 5 ? 'pointer' : 'not-allowed' }}
                  >
                    <div className={`absolute -inset-2 rounded-lg blur-xl ${energy >= 5 ? 'bg-green-400/25' : 'bg-slate-400/10'}`} />
                    <div className={`absolute inset-0 translate-y-1 rounded-lg ${energy >= 5 ? 'bg-green-700' : 'bg-slate-700'}`} />
                    <div className={`relative flex items-center justify-center gap-2 font-bold rounded-lg border-t ${
                      energy >= 5
                        ? 'bg-gradient-to-b from-green-400 to-green-500 text-white border-green-300/40'
                        : 'bg-gradient-to-b from-slate-500 to-slate-600 text-slate-300 border-slate-400/40'
                    }`} style={{ width: '160px', height: '42px' }}>
                      <span className="text-lg tracking-wider drop-shadow">START</span>
                      <div className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 ${energy >= 5 ? 'bg-green-600/50' : 'bg-slate-600/50'}`}>
                        <span className="text-xs font-bold">5</span>
                        <Zap size={12} className={energy >= 5 ? 'text-amber-300' : 'text-slate-400'} fill="currentColor" />
                      </div>
                    </div>
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== IMPRINT CHARACTER POPUP ===== */}
      <AnimatePresence>
        {actCompleteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-50"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Popup */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative bg-slate-800 border border-slate-600 rounded-2xl"
              style={{ width: '300px', padding: '32px 24px' }}
            >
              {/* Title */}
              <h2 className="text-amber-400 text-2xl font-bold text-center">
                Imprint Character
              </h2>

              {/* Imprint Button */}
              <div className="flex justify-center" style={{ marginTop: '32px' }}>
                <motion.button
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleImprint}
                >
                  <div className="absolute -inset-2 bg-purple-400/25 rounded-lg blur-xl" />
                  <div className="absolute inset-0 translate-y-1 bg-purple-700 rounded-lg" />
                  <div className="relative flex items-center justify-center bg-gradient-to-b from-purple-400 to-purple-500 text-white font-bold rounded-lg border-t border-purple-300/40" style={{ width: '160px', height: '48px' }}>
                    <span className="text-xl tracking-wider drop-shadow">IMPRINT</span>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== CHEST PANEL ===== */}
      <AnimatePresence>
        {chestOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900 z-50 flex flex-col"
          >
            {/* Top HUD */}
            <div className="flex items-center gap-3 px-6 pt-4">
              <div className="w-12 h-12 rounded-xl bg-slate-700 border-2 border-slate-500 flex items-center justify-center shrink-0">
                <User size={24} className="text-slate-300" />
              </div>
              <div className="flex-1 flex items-center justify-end gap-2">
                <div className="flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-lg" style={{ padding: '12px 20px' }}>
                  <Zap size={16} className="text-amber-400" fill="currentColor" />
                  <span className="text-white text-sm font-bold">{energy}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-lg" style={{ padding: '12px 20px' }}>
                  <Coins size={16} className="text-yellow-400" />
                  <span className="text-white text-sm font-bold">{coins}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-lg" style={{ padding: '12px 20px' }}>
                  <Gem size={16} className="text-purple-400" fill="currentColor" />
                  <span className="text-white text-sm font-bold">{gems}</span>
                </div>
              </div>
            </div>

            {/* Progress Rewards Banner */}
            <div style={{ margin: '32px 48px 0 48px' }}>
              <div className="bg-slate-800 border border-slate-600 rounded-lg py-3 px-6">
                <h2 className="text-white text-lg font-bold text-center">Progress Rewards</h2>
              </div>
            </div>

            {/* Days Carousel */}
            <DaysCarousel centerIndex={carouselIndex} survivedDays={survivedDays} currentAct={currentAct} />

            {/* Rewards Section */}
            <div style={{ margin: '32px 24px 0 24px' }}>
              <h3 className="text-white font-bold text-center mb-4">Rewards</h3>
              <div className="flex items-center justify-center gap-3">
                <div className="w-16 h-16 bg-slate-800 border border-slate-600 rounded-lg flex items-center justify-center">
                  <Coins size={28} className="text-yellow-400" />
                </div>
                <div className="w-16 h-16 bg-slate-800 border border-slate-600 rounded-lg flex items-center justify-center">
                  <Gem size={28} className="text-purple-400" />
                </div>
                <div className="w-16 h-16 bg-slate-800 border border-slate-600 rounded-lg flex items-center justify-center">
                  <Box size={28} className="text-amber-400" />
                </div>
              </div>
            </div>

            {/* Claim Button */}
            <div className="flex justify-center" style={{ marginTop: '24px' }}>
              <motion.button
                className="relative group"
                whileHover={canClaim ? { scale: 1.05 } : {}}
                whileTap={canClaim ? { scale: 0.95 } : {}}
                onClick={handleClaim}
                style={{ opacity: canClaim ? 1 : 0.4, cursor: canClaim ? 'pointer' : 'not-allowed' }}
              >
                <div className={`absolute -inset-2 rounded-lg blur-xl ${canClaim ? 'bg-green-400/25' : 'bg-slate-400/10'}`} />
                <div className={`absolute inset-0 translate-y-1 rounded-lg ${canClaim ? 'bg-green-700' : 'bg-slate-700'}`} />
                <div className={`relative flex items-center justify-center font-bold rounded-lg border-t ${
                  canClaim
                    ? 'bg-gradient-to-b from-green-400 to-green-500 text-white border-green-300/40'
                    : 'bg-gradient-to-b from-slate-500 to-slate-600 text-slate-300 border-slate-400/40'
                }`} style={{ width: '120px', height: '32px' }}>
                  <span className="text-sm tracking-wider drop-shadow">{canClaim ? 'Claim' : 'Locked'}</span>
                </div>
              </motion.button>
            </div>

            {/* Tap to close area */}
            <div
              className="flex-1 flex items-center justify-center cursor-pointer"
              onClick={() => setChestOpen(false)}
            >
              <p className="text-slate-500 text-sm">tap to close</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
