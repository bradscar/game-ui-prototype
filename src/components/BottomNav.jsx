import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Home, ArrowUp, Lock, ChevronDown } from 'lucide-react';

const tabs = [
  { id: 'settings', icon: Settings, label: 'Settings' },
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'skill', icon: ArrowUp, label: 'Skill' },
];

export default function BottomNav({ activeTab, onTabChange, ftueStep }) {
  const isSkillLocked = ftueStep === 'play';
  const showSkillArrow = ftueStep === 'skill-tab';

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-700/50">
      <div className="flex items-center justify-around h-20 px-4 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isSkillTab = tab.id === 'skill';
          const isDisabled = ftueStep !== 'complete' && (
            (ftueStep === 'play' && tab.id !== 'home') ||
            (ftueStep === 'skill-tab' && tab.id !== 'skill') ||
            (ftueStep === 'upgrade' && tab.id !== 'skill')
          );

          // For skill tab during FTUE lock, show lock icon instead
          const showLockIcon = isSkillTab && isSkillLocked;

          return (
            <motion.button
              key={tab.id}
              onClick={() => !isDisabled && onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-colors ${
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
                  className="absolute inset-0 bg-purple-500/20 rounded-2xl"
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
                    <Lock size={24} className="text-slate-600" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="icon"
                    initial={isSkillTab ? { scale: 0, opacity: 0 } : false}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
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

              {/* Bouncing arrow for skill tab */}
              <AnimatePresence>
                {isSkillTab && showSkillArrow && (
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
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
