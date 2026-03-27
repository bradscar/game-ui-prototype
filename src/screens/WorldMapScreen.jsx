import { useEffect, useRef } from 'react';

const levels = [
  // World 1 (Amber)
  { id: 1, world: 1, x: 50, y: 0, state: 'locked' },
  { id: 2, world: 1, x: 30, y: 1, state: 'locked' },
  { id: 3, world: 1, x: 70, y: 2, state: 'locked' },
  { id: 4, world: 1, x: 50, y: 3, state: 'locked' },
  // World 2 (Green)
  { id: 5, world: 2, x: 50, y: 0, state: 'locked' },
  { id: 6, world: 2, x: 30, y: 1, state: 'locked' },
  { id: 7, world: 2, x: 70, y: 2, state: 'locked' },
  { id: 8, world: 2, x: 50, y: 3, state: 'locked' },
  // World 3 (Purple)
  { id: 9, world: 3, x: 50, y: 0, state: 'locked' },
  { id: 10, world: 3, x: 30, y: 1, state: 'locked' },
  { id: 11, world: 3, x: 70, y: 2, state: 'locked' },
  { id: 12, world: 3, x: 50, y: 3, state: 'locked' },
];

const worldColors = {
  1: { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  2: { border: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
  3: { border: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)' },
};

function Landmass({ world, levelData, currentRef }) {
  const color = worldColors[world];
  const worldLevels = levelData.filter(l => l.world === world);
  const nodeSpacing = 45;
  const paddingY = 30;
  const height = paddingY * 2 + nodeSpacing * 3;

  const getPathState = (from, to) => {
    if (from.state === 'completed' && to.state === 'completed') return 'completed';
    if (from.state === 'completed' && to.state === 'current') return 'to-current';
    return 'locked';
  };

  return (
    <div
      className="relative mx-4 rounded-2xl"
      style={{
        height,
        border: `2px solid ${color.border}`,
        background: color.bg,
      }}
    >
      {/* Paths */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
      >
        {worldLevels.slice(0, -1).map((level, i) => {
          const next = worldLevels[i + 1];
          const y1 = paddingY + level.y * nodeSpacing;
          const y2 = paddingY + next.y * nodeSpacing;
          const pathState = getPathState(level, next);

          return (
            <line
              key={`path-${level.id}`}
              x1={level.x}
              y1={y1}
              x2={next.x}
              y2={y2}
              stroke={pathState === 'locked' ? '#334155' : color.border}
              strokeWidth="3"
              strokeDasharray={pathState === 'to-current' ? '4 4' : 'none'}
              opacity={pathState === 'locked' ? 0.3 : pathState === 'to-current' ? 0.5 : 0.8}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {worldLevels.map(level => {
        const isCurrent = level.state === 'current';
        const isLocked = level.state === 'locked';
        const size = isCurrent ? 20 : 16;

        return (
          <div
            key={level.id}
            ref={isCurrent ? currentRef : null}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${level.x}%`,
              top: paddingY + level.y * nodeSpacing,
              transform: 'translate(-50%, -50%)',
              border: `2px solid ${isLocked ? '#475569' : color.border}`,
              background: isLocked ? '#1e293b' : color.border,
              boxShadow: isCurrent ? `0 0 10px ${color.border}` : 'none',
            }}
          />
        );
      })}
    </div>
  );
}

export default function WorldMapScreen() {
  const scrollRef = useRef(null);
  const currentRef = useRef(null);

  useEffect(() => {
    if (currentRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const node = currentRef.current;
      const scrollTop = node.offsetTop - container.clientHeight / 2;
      container.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' });
    }
  }, []);

  return (
    <div ref={scrollRef} className="h-full pb-24 overflow-y-auto bg-slate-900">
      <div className="py-6 space-y-4">
        <Landmass world={1} levelData={levels} currentRef={currentRef} />

        {/* Ocean gap */}
        <div className="flex justify-center">
          <div className="w-px h-6 border-l-2 border-dashed border-slate-600" />
        </div>

        <Landmass world={2} levelData={levels} currentRef={currentRef} />

        {/* Ocean gap */}
        <div className="flex justify-center">
          <div className="w-px h-6 border-l-2 border-dashed border-slate-600" />
        </div>

        <Landmass world={3} levelData={levels} currentRef={currentRef} />
      </div>
    </div>
  );
}
