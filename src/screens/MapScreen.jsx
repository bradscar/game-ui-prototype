import { useState, useEffect } from 'react';
import { Coins, Sword, Heart, Shield, Zap, Target, Flame, Sparkles, Wind, Lock, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const skillDefs = [
  { id: 'attack', name: 'Attack', Icon: Sword, bgClass: 'bg-red-800/60', borderClass: 'border-red-500', iconClass: 'text-red-400' },
  { id: 'hp', name: 'HP', Icon: Heart, bgClass: 'bg-green-800/60', borderClass: 'border-green-500', iconClass: 'text-green-400' },
  { id: 'defense', name: 'Defense', Icon: Shield, bgClass: 'bg-blue-800/60', borderClass: 'border-blue-500', iconClass: 'text-blue-400' },
  { id: 'speed', name: 'Speed', Icon: Zap, bgClass: 'bg-yellow-800/60', borderClass: 'border-yellow-500', iconClass: 'text-yellow-400' },
  { id: 'critRate', name: 'Crit Rate', Icon: Target, bgClass: 'bg-orange-800/60', borderClass: 'border-orange-500', iconClass: 'text-orange-400' },
  { id: 'critDamage', name: 'Crit DMG', Icon: Flame, bgClass: 'bg-rose-800/60', borderClass: 'border-rose-500', iconClass: 'text-rose-400' },
  { id: 'luck', name: 'Luck', Icon: Sparkles, bgClass: 'bg-purple-800/60', borderClass: 'border-purple-500', iconClass: 'text-purple-400' },
  { id: 'dodge', name: 'Dodge', Icon: Wind, bgClass: 'bg-cyan-800/60', borderClass: 'border-cyan-500', iconClass: 'text-cyan-400' },
  { id: 'armor', name: 'Armor', Icon: Shield, bgClass: 'bg-slate-700/80', borderClass: 'border-slate-400', iconClass: 'text-slate-300' },
];

function SkillCard({ skill, level, isFlipping }) {
  const { name, Icon, bgClass, borderClass, iconClass } = skill;

  return (
    <div className="aspect-square" style={{ perspective: '1000px' }}>
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipping ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front face (locked) */}
        <div
          className="absolute inset-0 bg-slate-800 border border-slate-600 rounded-lg flex items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <Lock size={24} className="text-slate-600" />
        </div>

        {/* Back face (unlocked) */}
        <div
          className={`absolute inset-0 ${bgClass} border ${borderClass} rounded-lg flex flex-col items-center justify-center`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <Icon size={24} className={iconClass} />
          <span className="text-white text-xs font-semibold mt-1">{name}</span>
          <span className="text-white/80 text-xs">Lv.{level}</span>
        </div>
      </motion.div>
    </div>
  );
}

function UnlockedSkillCard({ skill, level }) {
  const { name, Icon, bgClass, borderClass, iconClass } = skill;

  return (
    <div className={`aspect-square ${bgClass} border ${borderClass} rounded-lg flex flex-col items-center justify-center`}>
      <Icon size={24} className={iconClass} />
      <span className="text-white text-xs font-semibold mt-1">{name}</span>
      <motion.span
        key={level}
        initial={{ scale: 1.3, color: '#fbbf24' }}
        animate={{ scale: 1, color: 'rgba(255,255,255,0.8)' }}
        transition={{ duration: 0.3 }}
        className="text-xs"
      >
        Lv.{level}
      </motion.span>
    </div>
  );
}

function LockedSkillCard() {
  return (
    <div className="aspect-square bg-slate-800 border border-slate-600 rounded-lg flex items-center justify-center">
      <Lock size={24} className="text-slate-600" />
    </div>
  );
}

export default function MapScreen({ coins, setCoins, skills, setSkills, ftueStep, setFtueStep }) {
  const [flippingSkill, setFlippingSkill] = useState(null);

  // Calculate total skill levels for upgrade cost
  const totalSkillLevels = Object.values(skills).reduce((sum, level) => sum + level, 0);
  const upgradeCost = 100 + (totalSkillLevels * 50);
  const canUpgrade = coins >= upgradeCost;
  const showUpgradeArrow = ftueStep === 'upgrade';

  // When entering skill screen during FTUE, advance to upgrade step
  useEffect(() => {
    if (ftueStep === 'skill-tab') {
      // Small delay so the screen transition completes first
      const timer = setTimeout(() => {
        setFtueStep('upgrade');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [ftueStep, setFtueStep]);

  const handleUpgrade = () => {
    if (!canUpgrade) return;

    setCoins(c => c - upgradeCost);

    const skillIds = skillDefs.map(s => s.id);
    const randomIndex = Math.floor(Math.random() * skillIds.length);
    const selectedSkillId = skillIds[randomIndex];
    const currentLevel = skills[selectedSkillId];

    if (currentLevel === 0) {
      setFlippingSkill(selectedSkillId);
      setTimeout(() => {
        setSkills(prev => ({ ...prev, [selectedSkillId]: 1 }));
      }, 300);
      setTimeout(() => {
        setFlippingSkill(null);
        // FTUE: Complete the tutorial after first upgrade
        if (ftueStep === 'upgrade') {
          setFtueStep('complete');
        }
      }, 600);
    } else {
      setSkills(prev => ({ ...prev, [selectedSkillId]: prev[selectedSkillId] + 1 }));
      // FTUE: Complete the tutorial after first upgrade
      if (ftueStep === 'upgrade') {
        setFtueStep('complete');
      }
    }
  };

  return (
    <div className="h-full pb-24">
      {/* Coin count centered */}
      <div className="flex justify-center" style={{ paddingTop: '48px', paddingBottom: '32px' }}>
        <div className="flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-lg px-5 py-2.5">
          <Coins size={20} className="text-yellow-400" />
          <span className="text-white text-lg font-bold">{coins}</span>
        </div>
      </div>

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-3" style={{ margin: '0 40px' }}>
        {skillDefs.map((skill, i) => {
          const level = skills[skill.id];
          const isFlipping = flippingSkill === skill.id;

          if (isFlipping) {
            return <SkillCard key={skill.id} skill={skill} level={1} isFlipping={true} />;
          }
          if (level > 0) {
            return <UnlockedSkillCard key={skill.id} skill={skill} level={level} />;
          }
          return <LockedSkillCard key={skill.id} />;
        })}
      </div>

      {/* Upgrade Button - matching HomeScreen button style */}
      <div className="flex justify-center relative" style={{ marginTop: '48px' }}>
        {/* Bouncing arrow for FTUE */}
        <AnimatePresence>
          {showUpgradeArrow && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ChevronDown size={32} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          className="relative group"
          whileHover={canUpgrade ? { scale: 1.05 } : {}}
          whileTap={canUpgrade ? { scale: 0.95 } : {}}
          onClick={handleUpgrade}
          style={{ cursor: canUpgrade ? 'pointer' : 'not-allowed' }}
        >
          <div className={`absolute -inset-4 rounded-lg blur-xl ${canUpgrade ? 'bg-green-400/25' : 'bg-slate-400/10'}`} />
          <div className={`absolute inset-0 translate-y-1.5 rounded-lg ${canUpgrade ? 'bg-green-700' : 'bg-slate-700'}`} />
          <div className={`relative flex items-center justify-center gap-3 font-bold w-60 h-16 rounded-lg border-t ${
            canUpgrade
              ? 'bg-gradient-to-b from-green-400 to-green-500 text-white border-green-300/40'
              : 'bg-gradient-to-b from-slate-500 to-slate-600 text-slate-300 border-slate-400/40'
          }`}>
            <span className="text-2xl tracking-wider drop-shadow">UPGRADE</span>
            <div className={`flex items-center gap-1 rounded-md px-2 py-1 ${canUpgrade ? 'bg-green-600/50' : 'bg-slate-600/50'}`}>
              <span className="text-sm font-bold">{upgradeCost}</span>
              <Coins size={14} className={canUpgrade ? 'text-yellow-300' : 'text-slate-400'} />
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
