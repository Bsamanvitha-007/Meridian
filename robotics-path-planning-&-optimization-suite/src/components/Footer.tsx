import React from 'react';
import { Cpu, ArrowUp, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 py-12 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Academic Note */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-100">
                Robotics Path Planning & Optimization Suite
              </div>
              <div className="text-slate-500">
                Computer Science & Engineering · Design and Analysis of Algorithms Case Study
              </div>
            </div>
          </div>

          {/* Quick Anchor Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <button onClick={() => scrollTo('overview')} className="hover:text-cyan-400 transition-colors">
              Overview
            </button>
            <span>·</span>
            <button onClick={() => scrollTo('queens')} className="hover:text-cyan-400 transition-colors">
              8-Queens
            </button>
            <span>·</span>
            <button onClick={() => scrollTo('hamiltonian')} className="hover:text-cyan-400 transition-colors">
              Hamiltonian
            </button>
            <span>·</span>
            <button onClick={() => scrollTo('tsp')} className="hover:text-cyan-400 transition-colors">
              TSP Cargo
            </button>
            <span>·</span>
            <button onClick={() => scrollTo('knapsack')} className="hover:text-cyan-400 transition-colors">
              Knapsack
            </button>
            <span>·</span>
            <button onClick={() => scrollTo('dashboard')} className="hover:text-cyan-400 transition-colors">
              Dashboard
            </button>
            <span>·</span>
            <button onClick={() => scrollTo('comparison')} className="hover:text-cyan-400 transition-colors">
              Comparison
            </button>
            <span>·</span>
            <button onClick={() => scrollTo('viva')} className="hover:text-cyan-400 transition-colors">
              Viva Prep
            </button>
          </div>

          {/* Back to Top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 text-center text-slate-600 text-[11px] leading-relaxed">
          Autonomous Algorithmic Decision Systems · Built with React 19, TypeScript, and Tailwind CSS.
          Zero external server dependencies — all state-space exploration, bounding functions, and pruning mechanics run client-side in the browser.
        </div>
      </div>
    </footer>
  );
};
