import React from 'react';
import { Bot, Network, Plane, Briefcase, ChevronDown, Compass, ShieldAlert, Cpu } from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore }) => {
  return (
    <section id="overview" className="relative pt-12 pb-20 overflow-hidden border-b border-slate-800/60">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Case Study Metadata Kicker */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-cyan-400 mb-4 tracking-wide">
          <span className="flex items-center gap-1.5 text-cyan-300">
            <Cpu className="w-3.5 h-3.5" />
            Advanced Algorithmic Engineering
          </span>
          <span className="text-slate-600" aria-hidden="true">·</span>
          <span className="text-slate-300">Robotics Path Planning</span>
          <span className="text-slate-600" aria-hidden="true">·</span>
          <span className="text-slate-300">PCB Design</span>
          <span className="text-slate-600" aria-hidden="true">·</span>
          <span className="text-slate-300">Airline Cargo Routing</span>
          <span className="text-slate-600" aria-hidden="true">·</span>
          <span className="text-slate-300">Investment Portfolio</span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] text-balance">
            Robotics Path Planning & Optimization Using{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">
              Backtracking and Branch & Bound
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
            Intelligent search algorithms for collision-free navigation, optimized circuit connections,
            efficient cargo routing, and budget-aware project selection. Explore how combinatorial search
            and bounding heuristics tackle NP-hard engineering challenges in real time.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onExplore}
              className="px-6 py-3.5 text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 group"
            >
              <span>Explore the Algorithms</span>
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
            <a
              href="#viva"
              className="px-6 py-3.5 text-sm font-medium text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Viva Preparation & Q&A</span>
            </a>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Interactive Slow Demonstration Mode (up to 3.0s per step) with Step Forward & Step Backward controls.</span>
          </div>
        </div>

        {/* Illustrated Engineering Network Diagram (SVG) */}
        <div className="mt-14 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-2xl relative overflow-hidden backdrop-blur-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 text-xs text-slate-400">
            <span className="font-semibold text-slate-200 uppercase tracking-wider">
              Algorithmic Search Domain Topology
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Active Exploration
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Feasible / Optimal
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                Pruned / Conflict
              </span>
            </div>
          </div>

          <div className="mt-4 w-full overflow-x-auto">
            <svg viewBox="0 0 1100 320" className="w-full min-w-[700px] h-auto select-none">
              <defs>
                <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="traceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Quadrant 1: Robotics Grid & Queen Placement */}
              <g transform="translate(40, 20)">
                <rect x="0" y="0" width="220" height="240" rx="12" fill="#020617" stroke="#1e293b" />
                <text x="110" y="24" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="600">
                  A. Robotics Grid (8-Queens)
                </text>
                {/* 4x4 mini subgrid */}
                {Array.from({ length: 4 }).map((_, r) =>
                  Array.from({ length: 4 }).map((_, c) => {
                    const isDark = (r + c) % 2 === 1;
                    return (
                      <rect
                        key={`cell-${r}-${c}`}
                        x={30 + c * 40}
                        y={45 + r * 40}
                        width="38"
                        height="38"
                        rx="4"
                        fill={isDark ? '#0f172a' : '#1e293b'}
                        stroke="#334155"
                        strokeWidth="0.5"
                      />
                    );
                  })
                )}
                {/* Robot Queens placed */}
                <circle cx={50} cy={65} r="10" fill="#06b6d4" filter="url(#glow)" />
                <circle cx={130} cy={105} r="10" fill="#06b6d4" filter="url(#glow)" />
                <circle cx={90} cy={145} r="10" fill="#06b6d4" filter="url(#glow)" />
                <circle cx={170} cy={185} r="10" fill="#06b6d4" filter="url(#glow)" />
                {/* Conflict lines in red (pruned) */}
                <line x1="50" y1="65" x2="170" y2="65" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                <text x="110" y="222" textAnchor="middle" fill="#94a3b8" fontSize="10">
                  Constraint Checking: O(N!) Search
                </text>
              </g>

              {/* Connecting Bus Line 1 */}
              <path d="M 270 140 H 310" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 4" />

              {/* Quadrant 2: PCB Circuit Traversal */}
              <g transform="translate(310, 20)">
                <rect x="0" y="0" width="220" height="240" rx="12" fill="#020617" stroke="#1e293b" />
                <text x="110" y="24" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="600">
                  B. PCB Connectivity (Hamiltonian)
                </text>
                {/* Circuit Traces */}
                <path d="M 60 70 L 160 70 L 180 140 L 110 190 L 40 140 Z" fill="none" stroke="#10b981" strokeWidth="2.5" filter="url(#glow)" />
                <line x1="60" y1="70" x2="180" y2="140" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
                {/* Components IC chips */}
                {[
                  { x: 60, y: 70, label: 'A' },
                  { x: 160, y: 70, label: 'B' },
                  { x: 180, y: 140, label: 'C' },
                  { x: 110, y: 190, label: 'D' },
                  { x: 40, y: 140, label: 'E' },
                ].map((node) => (
                  <g key={node.label}>
                    <circle cx={node.x} cy={node.y} r="12" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                    <text x={node.x} y={node.y + 4} textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">
                      {node.label}
                    </text>
                  </g>
                ))}
                <text x="110" y="222" textAnchor="middle" fill="#94a3b8" fontSize="10">
                  Closed Circuit Loop: O(V!)
                </text>
              </g>

              {/* Connecting Bus Line 2 */}
              <path d="M 540 140 H 580" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 4" />

              {/* Quadrant 3: Airline Cargo TSP */}
              <g transform="translate(580, 20)">
                <rect x="0" y="0" width="220" height="240" rx="12" fill="#020617" stroke="#1e293b" />
                <text x="110" y="24" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="600">
                  C. Airline Cargo (TSP B&B)
                </text>
                {/* Airport Network flight paths */}
                <path d="M 60 80 Q 110 50 160 80 T 170 170 T 80 180 Z" fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="5 3" />
                {[
                  { x: 60, y: 80, code: 'DEL' },
                  { x: 160, y: 80, code: 'BOM' },
                  { x: 170, y: 170, code: 'BLR' },
                  { x: 80, y: 180, code: 'HYD' },
                ].map((pt) => (
                  <g key={pt.code}>
                    <circle cx={pt.x} cy={pt.y} r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                    <text x={pt.x} y={pt.y + 3.5} textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
                      {pt.code}
                    </text>
                  </g>
                ))}
                {/* Airplane glyph */}
                <circle cx={110} cy={65} r="6" fill="#f59e0b" filter="url(#glow)" />
                <text x="110" y="222" textAnchor="middle" fill="#94a3b8" fontSize="10">
                  MST Lower Bound Pruning: 38 Units
                </text>
              </g>

              {/* Connecting Bus Line 3 */}
              <path d="M 810 140 H 850" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 4" />

              {/* Quadrant 4: Investment Portfolio Decision Tree */}
              <g transform="translate(850, 20)">
                <rect x="0" y="0" width="210" height="240" rx="12" fill="#020617" stroke="#1e293b" />
                <text x="105" y="24" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="600">
                  D. Portfolio (0/1 Knapsack)
                </text>
                {/* Decision Tree Nodes */}
                <circle cx={105} cy={55} r="9" fill="#06b6d4" />
                <line x1="105" y1="55" x2="60" y2="105" stroke="#334155" strokeWidth="1.5" />
                <line x1="105" y1="55" x2="150" y2="105" stroke="#334155" strokeWidth="1.5" />
                <circle cx={60} cy={105} r="8" fill="#10b981" />
                <circle cx={150} cy={105} r="8" fill="#f43f5e" />
                {/* Sub-branches */}
                <line x1="60" y1="105" x2="35" y2="155" stroke="#10b981" strokeWidth="1.5" />
                <line x1="60" y1="105" x2="85" y2="155" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx={35} cy={155} r="7" fill="#10b981" />
                <circle cx={85} cy={155} r="7" fill="#f43f5e" />
                <text x="150" y="125" textAnchor="middle" fill="#f43f5e" fontSize="8" fontWeight="bold">PRUNED</text>
                <text x="105" y="222" textAnchor="middle" fill="#94a3b8" fontSize="10">
                  Fractional Bound Relaxation
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-cyan-400">Backtracking</span>
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="mt-2 text-base font-semibold text-slate-100">8-Queens Collision-Free</h3>
            <p className="mt-1 text-xs text-slate-400">
              Discrete multi-robot sensor placement with zero laser line-of-sight collisions. 92 distinct configurations.
            </p>
            <div className="mt-3 text-xs font-mono text-slate-500 tabular-nums">
              Complexity: O(N!) worst-case
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-400">Backtracking</span>
              <Network className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="mt-2 text-base font-semibold text-slate-100">Hamiltonian PCB Circuit</h3>
            <p className="mt-1 text-xs text-slate-400">
              Closed continuous bus route traversing all electronic microchips exactly once without trace duplication.
            </p>
            <div className="mt-3 text-xs font-mono text-slate-500 tabular-nums">
              Complexity: O(V!) worst-case
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-blue-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-blue-400">Branch and Bound</span>
              <Plane className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="mt-2 text-base font-semibold text-slate-100">Airline Cargo TSP</h3>
            <p className="mt-1 text-xs text-slate-400">
              Minimum-expense flight dispatch connecting 5 metropolitan air cargo hubs via admissible MST lower bounds.
            </p>
            <div className="mt-3 text-xs font-mono text-slate-500 tabular-nums">
              Complexity: O(n!) worst-case
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-amber-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-400">Branch and Bound</span>
              <Briefcase className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="mt-2 text-base font-semibold text-slate-100">Knapsack Investment</h3>
            <p className="mt-1 text-xs text-slate-400">
              Optimal binary allocation of ₹12 Lakhs capital among projects using continuous fractional upper-bound pruning.
            </p>
            <div className="mt-3 text-xs font-mono text-slate-500 tabular-nums">
              Complexity: O(2ⁿ) worst-case
            </div>
          </div>
        </div>

        {/* Academic Simulation Disclaimer */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900/30 border border-slate-800/60 flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <div className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300 font-medium">Educational Simulation Model:</strong> This platform is designed for academic analysis in Computer Science Engineering (Design and Analysis of Algorithms). All numerical matrices, airport fuel units, component routing traces, and financial project returns are deterministic illustrative testbeds created to demonstrate state-space tree exploration, bounding heuristics, and branch pruning mechanics.
          </div>
        </div>
      </div>
    </section>
  );
};
