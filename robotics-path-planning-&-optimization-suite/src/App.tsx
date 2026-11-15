import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProblemOverviewSection } from './components/ProblemOverviewSection';
import { NQueensSimulator } from './components/NQueensSimulator';
import { HamiltonianSimulator } from './components/HamiltonianSimulator';
import { TSPSimulator } from './components/TSPSimulator';
import { KnapsackSimulator } from './components/KnapsackSimulator';
import { IntegratedDashboard } from './components/IntegratedDashboard';
import { AlgorithmComparison } from './components/AlgorithmComparison';
import { ArchitectureSection } from './components/ArchitectureSection';
import { VivaSection } from './components/VivaSection';
import { Footer } from './components/Footer';
import { DashboardSummary } from './types';
import { solveAllNQueens } from './algorithms/nQueens';
import { DEFAULT_PCB_GRAPH, findHamiltonianCycle } from './algorithms/hamiltonian';
import { DEFAULT_AIRPORTS, DEFAULT_TSP_MATRIX, solveTSPBranchAndBound } from './algorithms/tspBranchAndBound';
import { DEFAULT_PROJECTS, DEFAULT_BUDGET, solveKnapsackBranchAndBound } from './algorithms/knapsackBranchAndBound';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('overview');

  // Shared state for the Integrated Dashboard
  const [summary, setSummary] = useState<DashboardSummary>({
    queens: {
      status: 'Verified (92 Distinct Solutions)',
      totalSolutions: 92,
      exploredStates: 2056,
      rejectedStates: 1964,
    },
    hamiltonian: {
      cycleFound: true,
      cycleSequence: 'A → B → C → D → E → F → A',
      exploredStates: 24,
      rejectedStates: 18,
    },
    tsp: {
      optimalCost: 38,
      baselineCost: 43,
      expandedNodes: 16,
      prunedNodes: 22,
      costReductionPercent: 11.6,
    },
    knapsack: {
      optimalReturn: 205,
      baselineReturn: 170,
      investedCost: 11,
      remainingBudget: 1,
      prunedNodes: 14,
      efficiencyGainPercent: 20.5,
    },
  });

  // Track active section on scroll
  useEffect(() => {
    const sectionIds = [
      'overview',
      'queens',
      'hamiltonian',
      'tsp',
      'knapsack',
      'dashboard',
      'comparison',
      'architecture',
      'viva',
    ];

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offset = 180;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el && el.offsetTop - offset <= scrollY) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Run all simulators in batch and synchronize dashboard metrics
  const handleRunAll = () => {
    // 1. Solve 8-Queens
    const queensSolutions = solveAllNQueens(8);

    // 2. Solve Hamiltonian PCB
    const hamResult = findHamiltonianCycle(DEFAULT_PCB_GRAPH, 0, ['A', 'B', 'C', 'D', 'E', 'F']);

    // 3. Solve TSP
    const tspResult = solveTSPBranchAndBound(DEFAULT_TSP_MATRIX, 0, DEFAULT_AIRPORTS);

    // 4. Solve Knapsack
    const knapResult = solveKnapsackBranchAndBound(DEFAULT_PROJECTS, DEFAULT_BUDGET);

    setSummary({
      queens: {
        status: `${queensSolutions.length} Solutions Verified`,
        totalSolutions: queensSolutions.length,
        exploredStates: 2056,
        rejectedStates: 1964,
      },
      hamiltonian: {
        cycleFound: hamResult.cycleFound,
        cycleSequence: hamResult.cycleFound
          ? hamResult.cycle.map((v) => ['A', 'B', 'C', 'D', 'E', 'F'][v]).join(' → ')
          : 'None',
        exploredStates: hamResult.exploredStates,
        rejectedStates: hamResult.rejectedStates,
      },
      tsp: {
        optimalCost: tspResult.optimalCost,
        baselineCost: tspResult.baselineCost,
        expandedNodes: tspResult.expandedNodes,
        prunedNodes: tspResult.prunedNodes,
        costReductionPercent: Math.round(
          ((tspResult.baselineCost - tspResult.optimalCost) / tspResult.baselineCost) * 100
        ),
      },
      knapsack: {
        optimalReturn: knapResult.optimalReturn,
        baselineReturn: knapResult.baselineReturn,
        investedCost: knapResult.optimalCost,
        remainingBudget: DEFAULT_BUDGET - knapResult.optimalCost,
        prunedNodes: knapResult.prunedNodes,
        efficiencyGainPercent: Math.round(
          ((knapResult.optimalReturn - knapResult.baselineReturn) / knapResult.baselineReturn) * 100
        ),
      },
    });

    // Smoothly scroll down to dashboard to show updated analytics
    const dash = document.getElementById('dashboard');
    if (dash) {
      dash.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Sticky Navigation Bar with Top Bar Contract & Progress */}
      <Navbar activeSection={activeSection} onRunAll={handleRunAll} />

      {/* Main Single-Page Content Canvas */}
      <main className="flex-1">
        {/* Section 1: Hero */}
        <HeroSection
          onExplore={() => {
            const el = document.getElementById('queens');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Section 2: Real-World Problem Overview */}
        <ProblemOverviewSection />

        {/* Section 3: Algorithm 1 — 8-Queens Problem Using Backtracking */}
        <NQueensSimulator
          onUpdateStats={({ explored, rejected, solutions }) => {
            setSummary((prev) => ({
              ...prev,
              queens: {
                ...prev.queens,
                exploredStates: explored,
                rejectedStates: rejected,
                totalSolutions: solutions,
              },
            }));
          }}
        />

        {/* Section 4: Algorithm 2 — Hamiltonian Cycle Using Backtracking */}
        <HamiltonianSimulator
          onUpdateStats={({ found, sequence, explored }) => {
            setSummary((prev) => ({
              ...prev,
              hamiltonian: {
                ...prev.hamiltonian,
                cycleFound: found,
                cycleSequence: sequence,
                exploredStates: explored,
              },
            }));
          }}
        />

        {/* Section 5: Algorithm 3 — TSP Using Branch and Bound */}
        <TSPSimulator
          onUpdateStats={({ optimalCost, baselineCost, expanded, pruned }) => {
            setSummary((prev) => ({
              ...prev,
              tsp: {
                optimalCost,
                baselineCost,
                expandedNodes: expanded,
                prunedNodes: pruned,
                costReductionPercent: Math.round(((baselineCost - optimalCost) / baselineCost) * 100),
              },
            }));
          }}
        />

        {/* Section 6: Algorithm 4 — 0/1 Knapsack Using Branch and Bound */}
        <KnapsackSimulator
          onUpdateStats={({ optimalReturn, baselineReturn, invested, pruned }) => {
            setSummary((prev) => ({
              ...prev,
              knapsack: {
                optimalReturn,
                baselineReturn,
                investedCost: invested,
                remainingBudget: DEFAULT_BUDGET - invested,
                prunedNodes: pruned,
                efficiencyGainPercent: Math.round(((optimalReturn - baselineReturn) / baselineReturn) * 100),
              },
            }));
          }}
        />

        {/* Section 7: Integrated Engineering Optimization Dashboard */}
        <IntegratedDashboard summary={summary} onRunAll={handleRunAll} />

        {/* Section 8: Algorithm Comparison */}
        <AlgorithmComparison />

        {/* Section 9: Implementation Architecture */}
        <ArchitectureSection />

        {/* Section 10: Conclusion and Viva Preparation */}
        <VivaSection />
      </main>

      {/* Global Academic Footer */}
      <Footer />
    </div>
  );
}
