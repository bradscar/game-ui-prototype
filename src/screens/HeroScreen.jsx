import { useState, useEffect } from 'react';
import { User, Sword, Shield, HardHat, Shirt, Footprints, Circle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Gear slot definitions
const gearSlots = [
  { id: 'helmet', position: 'left', icon: HardHat, label: 'Helmet' },
  { id: 'chest', position: 'left', icon: Shirt, label: 'Chest' },
  { id: 'boots', position: 'left', icon: Footprints, label: 'Boots' },
  { id: 'weapon', position: 'right', icon: Sword, label: 'Weapon' },
  { id: 'shield', position: 'right', icon: Shield, label: 'Shield' },
  { id: 'ring', position: 'right', icon: Circle, label: 'Ring' },
];


const rarityColors = {
  common: { bg: 'bg-slate-700', border: 'border-slate-500', text: 'text-slate-300' },
  uncommon: { bg: 'bg-green-900/60', border: 'border-green-500', text: 'text-green-400' },
  rare: { bg: 'bg-blue-900/60', border: 'border-blue-500', text: 'text-blue-400' },
  epic: { bg: 'bg-purple-900/60', border: 'border-purple-500', text: 'text-purple-400' },
};

function GearSlot({ slot, equipped, onTap }) {
  const Icon = slot.icon;
  const item = equipped;
  const colors = item ? rarityColors[item.rarity] : null;

  return (
    <button
      onClick={() => onTap(slot.id)}
      className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-colors ${
        item
          ? `${colors.bg} ${colors.border} border-solid`
          : 'border-dashed border-slate-700 bg-slate-800/40'
      }`}
    >
      {item ? (
        <Icon size={22} className={colors.text} />
      ) : (
        <Icon size={18} className="text-slate-700" />
      )}
    </button>
  );
}

function InventoryItem({ item, onTap, showArrow }) {
  const colors = rarityColors[item.rarity];
  const slotDef = gearSlots.find(s => s.id === item.slot);
  const Icon = slotDef?.icon || Circle;

  return (
    <div className="relative">
      {/* Bouncing arrow for FTUE */}
      <AnimatePresence>
        {showArrow && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 z-10"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown size={24} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => onTap(item)}
        className={`aspect-square rounded-lg border ${colors.bg} ${colors.border} flex items-center justify-center w-full`}
      >
        <Icon size={22} className={colors.text} />
      </button>
    </div>
  );
}

export default function HeroScreen({
  inventory,
  setInventory,
  equipped,
  setEquipped,
  ftueStep,
  setFtueStep,
  pendingGear,
  setPendingGear,
}) {
  const [newGearId, setNewGearId] = useState(null); // Track newly added gear for arrow

  const leftSlots = gearSlots.filter(s => s.position === 'left');
  const rightSlots = gearSlots.filter(s => s.position === 'right');

  // When entering Hero screen with pending gear, add it to inventory
  useEffect(() => {
    if (pendingGear && ftueStep === 'hero-tab') {
      // Add pending gear to inventory
      setInventory(prev => [...prev, pendingGear]);
      setNewGearId(pendingGear.id);
      setPendingGear(null);
      // Advance to equip step
      setTimeout(() => {
        setFtueStep('equip');
      }, 300);
    }
  }, [pendingGear, ftueStep, setInventory, setPendingGear, setFtueStep]);

  const handleEquip = (item) => {
    // Unequip current item in that slot (if any)
    const currentEquipped = equipped[item.slot];

    // Equip new item
    setEquipped(prev => ({ ...prev, [item.slot]: item }));

    // Remove from inventory and add old item back
    setInventory(prev => {
      let newInv = prev.filter(i => i.id !== item.id);
      if (currentEquipped) {
        newInv = [...newInv, currentEquipped];
      }
      return newInv;
    });

    // FTUE: Complete tutorial when equipping the new gear
    if (ftueStep === 'equip' && item.id === newGearId) {
      setNewGearId(null);
      setTimeout(() => {
        setFtueStep('complete');
      }, 300);
    }
  };

  const handleUnequip = (slotId) => {
    const item = equipped[slotId];
    if (!item) return;

    // Add back to inventory
    setInventory(prev => [...prev, item]);

    // Clear slot
    setEquipped(prev => ({ ...prev, [slotId]: null }));
  };

  return (
    <div className="h-full pb-24 flex flex-col">
      {/* Top Half - Hero & Gear Slots */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="flex items-center gap-5">
          {/* Left Slots */}
          <div className="flex flex-col gap-3">
            {leftSlots.map(slot => (
              <GearSlot
                key={slot.id}
                slot={slot}
                equipped={equipped[slot.id]}
                onTap={handleUnequip}
              />
            ))}
          </div>

          {/* Hero Silhouette */}
          <div className="w-28 h-40 bg-slate-800/60 border-2 border-slate-700 rounded-2xl flex items-center justify-center">
            <User size={56} className="text-slate-600" />
          </div>

          {/* Right Slots */}
          <div className="flex flex-col gap-3">
            {rightSlots.map(slot => (
              <GearSlot
                key={slot.id}
                slot={slot}
                equipped={equipped[slot.id]}
                onTap={handleUnequip}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-700" style={{ margin: '0 32px' }} />

      {/* Bottom Half - Inventory Grid */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '20px 32px 20px 32px' }}>
        <div className="grid grid-cols-5 gap-2.5">
          {inventory.map(item => (
            <InventoryItem
              key={item.id}
              item={item}
              onTap={handleEquip}
              showArrow={ftueStep === 'equip' && item.id === newGearId}
            />
          ))}
          {/* Empty slots to fill grid */}
          {Array.from({ length: Math.max(0, 15 - inventory.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="aspect-square rounded-lg border border-dashed border-slate-700/50 bg-slate-800/20"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
