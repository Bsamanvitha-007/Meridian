import React, { useState } from 'react';
import { Layers, CheckCircle2, Cpu, ShieldCheck, ArrowDown, Code2 } from 'lucide-react';

export const ArchitectureSection: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<number>(0);

  const architectureLayers = [
    {
      title: '1. User Interface & Presentation Layer',
      subtitle: 'Responsive React 19 SPA + Tailwind CSS + Lucide Icons',
      description:
        'Provides intuitive interactive stages (8x8 robotics grid, SVG PCB schematic, Indian air cargo network, and portfolio project cards) with speed sliders and step-by-step playback controls.',
      dataStructures: 'React Hooks (useState, useEffect, useRef), SVG path coordinates, accessibility ARIA labels.',
    },
    {
      title: '2. Input Validation & Parameter Sanitization',
      subtitle: 'Guarantees Invariant Integrity Before Search',
      description:
        'Validates matrix symmetry ($M[i][j] = M[j][i]$), non-negativity, zero diagonal ($M[i][i] = 0$), non-negative budgets, and valid starting hub indices to prevent infinite loops or undefined graph traversal.',
      dataStructures: 'Matrix dimension assertions, bounded numeric bounds check, graph connectivity sanity checks.',
    },
    {
      title: '3. Algorithm Selection & Mode Dispatcher',
      subtitle: 'Routes Problem to Backtracking or Branch & Bound',
      description:
        'Dispatches execution to the corresponding solver. Backtracking handles constraint-satisfaction problems (8-Queens, Hamiltonian Cycle); Branch & Bound handles combinatorial optimization (TSP, 0/1 Knapsack).',
      dataStructures: 'Modular JavaScript ES modules, isolated pure functional dispatchers.',
    },
    {
      title: '4. State-Space Tree Generation Engine',
      subtitle: 'Hierarchical Node Expansion & Priority Ordering',
      description:
        'Generates candidate branches dynamically. For Backtracking, advances depth-first through candidate vectors. For Branch & Bound, enqueues child nodes into a Priority Queue ordered by bounding heuristic.',
      dataStructures: 'Recursion stack (Backtracking), Priority Queue / Min-Heap / Max-Heap (Branch & Bound).',
    },
    {
      title: '5. Constraint Checking & Admissible Bounding Functions',
      subtitle: 'Instant Feasibility Tests and Pruning Mechanics',
      description:
        'Evaluates safety checks for Backtracking (diagonal and column laser line-of-sight). For Branch & Bound, computes admissible relaxations (MST lower bound for TSP; Fractional Knapsack upper bound for portfolio).',
      dataStructures: 'Prim’s MST algorithm on unvisited subsets, greedy continuous ratio relaxation.',
    },
    {
      title: '6. Solution Reconstruction & Incumbent Tracking',
      subtitle: 'Backtracking Recovery & Global Optimum Recording',
      description:
        'Tracks the best complete tour or selection discovered so far (incumbent). When a superior feasible state is reached, the incumbent is updated and serves as the benchmark to prune subsequent branches.',
      dataStructures: 'Best-known cost scalar, state path array, 92-solution collection array.',
    },
    {
      title: '7. Real-Time Visualization & Dashboard Telemetry',
      subtitle: 'Step Traces, SVG Canvas Highlighting, & Metric Sync',
      description:
        'Translates discrete search steps into graphical cues: electric cyan for active exploration, crimson red for pruned collisions, and emerald green for confirmed optimal solutions and closed cycles.',
      dataStructures: 'Trace step history array, animated timer tickers, reactive metric states.',
    },
  ];

  return (
    <section id="architecture" className="py-20 border-b border-slate-800/60 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            Section 9 · System Engineering
          </div>
          <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Implementation Architecture & Software Pipeline
          </h2>
          <p className="mt-4 text-xs sm:text-base text-slate-300 leading-relaxed">
            The platform is built as a pure client-side educational simulation suite with zero external backend
            dependencies. All algorithms execute locally with deterministic precision in the browser runtime.
          </p>
        </div>

        {/* Interactive Architecture Stack */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Layered Stack Diagram (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            {architectureLayers.map((layer, idx) => {
              const isSelected = activeLayer === idx;
              return (
                <div key={layer.title}>
                  <button
                    onClick={() => setActiveLayer(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                        : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center ${
                          isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-100">{layer.title}</h4>
                        <span className="text-xs text-slate-400">{layer.subtitle}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-cyan-400 font-semibold">
                      {isSelected ? 'ACTIVE VIEW' : 'INSPECT'}
                    </span>
                  </button>

                  {idx < architectureLayers.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Selected Layer Deep Dive (5 cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  LAYER SPECIFICATION DRILL-DOWN
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Tier {activeLayer + 1} of 7
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  {architectureLayers[activeLayer].title}
                </h3>
                <span className="text-xs font-medium text-cyan-300">
                  {architectureLayers[activeLayer].subtitle}
                </span>
              </div>

              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-300 block mb-1">
                  System Responsibility:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {architectureLayers[activeLayer].description}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-mono font-semibold text-slate-400 block">
                  DATA STRUCTURES & PATTERNS:
                </span>
                <p className="text-xs font-mono text-emerald-400 leading-relaxed">
                  {architectureLayers[activeLayer].dataStructures}
                </p>
              </div>

              {/* Technology Stack Badges */}
              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400 block mb-2 font-medium">
                  Underlying Technology Stack:
                </span>
                <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-300">
                  <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">TypeScript 5.x</span>
                  <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">React 19 SPA</span>
                  <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">Tailwind CSS</span>
                  <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">Declarative SVG</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
