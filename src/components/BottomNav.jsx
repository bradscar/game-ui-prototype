import { motion, AnimatePresence } from 'framer-motion';
import { User, Home, ArrowUp, Lock, ChevronDown, Star, Map } from 'lucide-react';

const tabs = [
  { id: 'mystery', icon: Star, label: '???' },
  { id: 'hero', icon: User, label: 'Hero' },
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'skill', icon: ArrowUp, label: 'Skill' },
  { id: 'map', icon: Map, label: 'Map' },
];

export default function BottomNav({ activeTab, onTabChange, ftueStep, coins = 0, skills = {} }) {
  const isSkillLocked = ftueStep === 'play';
  const showSkillArrow = ftueStep === 'skill-tab';
  const isHeroLocked = ['play', 'skill-tab', 'upgrade', 'grinding'].includes(ftueStep);
  const showHeroArrow = ftueStep === 'hero-tab';
  const isMysteryLocked = true; // Always locked
  const isMapLocked = ftueStep !== 'complete'; // Unlocked after FTUE

  // Calculate if skill upgrade is available
  const totalSkillLevels = Object.values(skills).reduce((sum, level) => sum + level, 0);
  const upgradeCost = 100 + (totalSkillLevels * 50);
  const canUpgrade = !isSkillLocked && coins >= upgradeCost;

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-700/50">
      <div className="flex items-center justify-around h-20 px-4 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isSkillTab = tab.id === 'skill';
          const isHeroTab = tab.id === 'hero';
          const isMysteryTab = tab.id === 'mystery';
          const isMapTab = tab.id === 'map';

          // Mystery tab is always disabled, Map disabled until FTUE complete
          const isDisabled = isMysteryTab || (isMapTab && isMapLocked) || (ftueStep !== 'complete' && (
            (ftueStep === 'play' && tab.id !== 'home') ||
            (ftueStep === 'skill-tab' && tab.id !== 'skill') ||
            (ftueStep === 'upgrade' && tab.id !== 'skill') ||
            (ftueStep === 'grinding' && tab.id === 'hero') ||
            (ftueStep === 'hero-tab' && tab.id !== 'hero') ||
            (ftueStep === 'equip' && tab.id !== 'hero')
          ));

          // Show lock icon for locked tabs
          const showLockIcon = (isSkillTab && isSkillLocked) || (isHeroTab && isHeroLocked) || (isMysteryTab && isMysteryLocked) || (isMapTab && isMapLocked);
          const showArrow = (isSkillTab && showSkillArrow) || (isHeroTab && showHeroArrow);

          return (
            <motion.button
              key={tab.id}
              onClick={() => !isDisabled && onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-colors ${
                isDisabled
                  ? 'text-slate-700 cursor-not-allowed'
                  : isActive
                    ? 'text-purple-400'
                    : 'text-slate-500 hover:text-slate-300'
              }`}
              whileTap={!isDisabled ? { scale: 0.9 } : {}}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-purple-500/20 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
                />
              )}

              {/* Icon - show lock or normal icon */}
              <AnimatePresence mode="wait">
                {showLockIcon ? (
                  <motion.div
                    key="lock"
                    initial={{ scale: 1 }}
                    exit={{
                      scale: [1, 1.2, 0],
                      rotate: [0, -15, 15, 0],
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <Lock size={20} className="text-slate-600" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="icon"
                    initial={isSkillTab ? { scale: 0, opacity: 0 } : false}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Label - show lock text or normal label */}
              <AnimatePresence mode="wait">
                {showLockIcon ? (
                  <motion.span
                    key="locked"
                    exit={{ opacity: 0 }}
                    className="text-xs mt-1 font-medium text-slate-700"
                  >
                    Locked
                  </motion.span>
                ) : (
                  <motion.span
                    key="label"
                    initial={isSkillTab ? { opacity: 0 } : false}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="text-xs mt-1 font-medium"
                  >
                    {tab.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Bouncing arrow for skill/hero tab */}
              <AnimatePresence>
                {showArrow && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-8"
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <ChevronDown size={28} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Red indicator for skill upgrade available */}
              {isSkillTab && canUpgrade && !isActive && (
                <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900" />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
