export default function MobileFrame({ children }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-400 p-4">
      {/* Phone frame */}
      <div className="relative w-full max-w-[390px] h-full max-h-[844px] bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden border-4 border-slate-800">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-50" />

        {/* Screen content */}
        <div className="absolute inset-0 top-8 bottom-0">
          {children}
        </div>
      </div>
    </div>
  );
}
