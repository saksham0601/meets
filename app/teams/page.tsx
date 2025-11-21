export default function Meets() {
  return (
    <div>
      < div className="min-h-screen flex items-center justify-center p-8" >
        <div className="relative max-w-3xl w-full">
          {/* Centered frosted card */}
          <div className="mx-auto p-12 rounded-2xl max-w-2xl">
            <div className="relative rounded-2xl overflow-hidden">
              {/* Glass panel */}
              <div className="backdrop-blur-xl bg-white/30 border border-white/30 rounded-2xl shadow-[0_8px_30px_rgba(16,24,40,0.08)] ring-1 ring-white/20 p-8">
                <h2 className="text-2xl font-semibold text-slate-900">Frosted glass card</h2>
                <p className="mt-3 text-slate-700">A gentle frosted-glass effect using Tailwind CSS utilities. Works best on light backgrounds — if you place this over a photo or gradient the blur becomes more pronounced.</p>


                <div className="mt-6 grid grid-cols-2 gap-4">
                  <button className="px-4 py-2 rounded-lg bg-white/40 hover:bg-white/50 border border-white/20 shadow-sm">Primary</button>
                  <button className="px-4 py-2 rounded-lg bg-transparent border border-white/20 hover:bg-white/10">Secondary</button>
                </div>
              </div>


              {/* subtle gradient overlay to add richness to the glass */}
              <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl mix-blend-screen opacity-40">
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0) 40%, rgba(255,255,255,0.04) 100%)',
                  height: '100%'
                }} />
              </div>


              {/* optional film grain (SVG) for realism */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 600 400" aria-hidden>
                <filter id="grain">
                  <feTurbulence baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
                  <feColorMatrix type="saturate" values="0" />
                  <feComponentTransfer>
                    <feFuncA type="table" tableValues="0 0.06" />
                  </feComponentTransfer>
                </filter>
                <rect width="100%" height="100%" filter="url(#grain)" opacity="0.06" />
              </svg>
            </div>


            {/* A row of smaller glass cards to show how it scales */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="backdrop-blur-md bg-white/20 border border-white/20 rounded-xl p-4 text-center">
                  <div className="text-sm font-medium text-slate-900">Item {i + 1}</div>
                  <div className="text-xs text-slate-600 mt-1">Description</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div ></div>
  );
}
