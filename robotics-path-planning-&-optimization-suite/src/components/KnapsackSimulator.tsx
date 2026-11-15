import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  TrendingUp,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  DollarSign,
  Info,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  DEFAULT_PROJECTS,
  DEFAULT_BUDGET,
  solveKnapsackBranchAndBound,
} from '../algorithms/knapsackBranchAndBound';
import { KnapsackNode, KnapsackStep, ProjectItem } from '../types';

interface KnapsackSimulatorProps {
  onUpdateStats?: (stats: { optimalReturn: number; baselineReturn: number; invested: number; pruned: number }) => void;
}

export const KnapsackSimulator: React.FC<KnapsackSimulatorProps> = ({ onUpdateStats }) => {
  const [projects, setProjects] = useState<ProjectItem[]>(DEFAULT_PROJECTS);
  const [budget, setBudget] = useState<number>(DEFAULT_BUDGET);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1200); // 1.2s default presentation pace
  const [steps, setSteps] = useState<KnapsackStep[]>([]);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [treeNodes, setTreeNodes] = useState<KnapsackNode[]>([]);
  const [optimalSelection, setOptimalSelection] = useState<boolean[]>([]);
  const [optimalCost, setOptimalCost] = useState<number>(0);
  const [optimalReturn, setOptimalReturn] = useState<number>(0);
  const [baselineReturn, setBaselineReturn] = useState<number>(0);
  const [expandedNodes, setExpandedNodes] = useState<number>(0);
  const [prunedNodes, setPrunedNodes] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>(
    'Configure investment initiatives or capital budget, then click "Optimize Portfolio".'
  );

  const timerRef = useRef<number | null>(null);

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSolving(false);
    setIsPaused(false);
    setSteps([]);
    setStepIndex(0);
    setTreeNodes([]);
    setOptimalSelection([]);
    setOptimalCost(0);
    setOptimalReturn(0);
    setBaselineReturn(0);
    setExpandedNodes(0);
    setPrunedNodes(0);
    setStatusMessage('Investment portfolio state reset. Ready for computation.');
  };

  const handleRunAlgorithm = () => {
    handleReset();
    const result = solveKnapsackBranchAndBound(projects, budget);

    setSteps(result.steps);
    setTreeNodes(result.treeNodes);
    setOptimalSelection(result.optimalSelection);
    setOptimalCost(result.optimalCost);
    setOptimalReturn(result.optimalReturn);
    setBaselineReturn(result.baselineReturn);
    setExpandedNodes(result.expandedNodes);
    setPrunedNodes(result.prunedNodes);

    setIsSolving(true);
    setIsPaused(false);
    setStepIndex(0);

    if (onUpdateStats) {
      onUpdateStats({
        optimalReturn: result.optimalReturn,
        baselineReturn: result.baselineReturn,
        invested: result.optimalCost,
        pruned: result.prunedNodes,
      });
    }
  };

  // Step loop
  useEffect(() => {
    if (isSolving && !isPaused && steps.length > 0) {
      timerRef.current = window.setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            clearInterval(timerRef.current!);
            setIsSolving(false);
            return prev;
          }
          const next = prev + 1;
          setStatusMessage(steps[next].message);
          return next;
        });
      }, speed);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [isSolving, isPaused, steps, speed]);

  const stepForward = () => {
    if (stepIndex < steps.length - 1) {
      const next = stepIndex + 1;
      setStepIndex(next);
      setStatusMessage(steps[next].message);
    }
  };

  const stepBackward = () => {
    if (stepIndex > 0) {
      const prev = stepIndex - 1;
      setStepIndex(prev);
      setStatusMessage(steps[prev].message);
    }
  };

  // Update project cost or return
  const updateProject = (id: string, field: 'cost' | 'expectedReturn', val: number) => {
    const updated = projects.map((p) => {
      if (p.id === id) {
        const nextVal = Math.max(1, val);
        const cost = field === 'cost' ? nextVal : p.cost;
        const expectedReturn = field === 'expectedReturn' ? nextVal : p.expectedReturn;
        return {
          ...p,
          [field]: nextVal,
          ratio: Math.round((expectedReturn / cost) * 100) / 100,
        };
      }
      return p;
    });
    setProjects(updated);
    handleReset();
  };

  // Add project
  const addProject = () => {
    if (projects.length >= 8) return;
    const nextChar = String.fromCharCode(65 + projects.length);
    const newP: ProjectItem = {
      id: `proj-${nextChar}`,
      name: `Project ${nextChar} (Expansion)`,
      cost: 4,
      expectedReturn: 60,
      ratio: 15.0,
    };
    setProjects([...projects, newP]);
    handleReset();
  };

  // Remove project
  const removeProject = (id: string) => {
    if (projects.length <= 3) return;
    setProjects(projects.filter((p) => p.id !== id));
    handleReset();
  };

  const currentStep = steps[stepIndex];
  const activeBestProfit = currentStep ? currentStep.bestProfit : optimalReturn;

  return (
    <section id="knapsack" className="py-20 border-b border-slate-800/60 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
            Algorithm 4 · Branch and Bound
          </div>
          <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Investment Portfolio Optimization Using Branch and Bound
          </h2>
          <p className="mt-4 text-xs sm:text-base text-slate-300 leading-relaxed">
            An organization must allocate a strict capital budget (₹12 Lakhs) among indivisible engineering initiatives.
            Each project has a capital cost and an expected return. Branch and Bound uses the continuous Fractional
            Knapsack relaxation as an admissible upper bound: any partial selection whose optimistic upper bound cannot
            exceed the best complete portfolio found is instantly pruned.
          </p>
        </div>

        {/* Toolbar & Budget Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="font-semibold text-amber-400">Capital Budget:</span>
              <input
                type="range"
                min="6"
                max="24"
                step="1"
                value={budget}
                onChange={(e) => {
                  setBudget(Number(e.target.value));
                  handleReset();
                }}
                disabled={isSolving}
                className="w-28 accent-amber-400 cursor-pointer"
              />
              <span className="font-mono text-amber-300 font-bold tabular-nums">
                ₹{budget} Lakhs
              </span>
            </div>

            <button
              onClick={addProject}
              disabled={projects.length >= 8 || isSolving}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1 disabled:opacity-40"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Initiative
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunAlgorithm}
              disabled={isSolving && !isPaused}
              className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              Optimize Portfolio
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Reset Portfolio"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Workspace Grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Project Cards & Decision Tree (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Candidate Project Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projects.map((proj, idx) => {
                const isSelected = optimalSelection[idx] === true;

                return (
                  <div
                    key={proj.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-amber-950/20 border-amber-500/60 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {proj.name}
                      </span>
                      {projects.length > 3 && (
                        <button
                          onClick={() => removeProject(proj.id)}
                          disabled={isSolving}
                          className="text-slate-500 hover:text-rose-400 p-0.5"
                          title="Remove Project"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400">Cost:</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={proj.cost}
                            disabled={isSolving}
                            onChange={(e) => updateProject(proj.id, 'cost', Number(e.target.value))}
                            className="w-12 py-0.5 px-1 bg-slate-950 border border-slate-800 rounded text-amber-300 font-mono text-xs"
                          />
                          <span className="text-slate-400 text-[10px]">Lakhs</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400">Return:</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <input
                            type="number"
                            min="5"
                            max="300"
                            step="5"
                            value={proj.expectedReturn}
                            disabled={isSolving}
                            onChange={(e) =>
                              updateProject(proj.id, 'expectedReturn', Number(e.target.value))
                            }
                            className="w-14 py-0.5 px-1 bg-slate-950 border border-slate-800 rounded text-emerald-300 font-mono text-xs"
                          />
                          <span className="text-slate-400 text-[10px]">Lakhs</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-800/40 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Ratio (P/W):</span>
                      <span className="font-mono text-cyan-400 font-semibold">{proj.ratio.toFixed(2)}</span>
                    </div>

                    {isSelected && (
                      <div className="mt-2 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Selected in Optimal Portfolio
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Active Step Action Callout Banner */}
            {steps.length > 0 && steps[stepIndex] && (
              <div className="p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all bg-slate-950/90 border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 text-[11px]">
                    Step {stepIndex + 1}/{steps.length}:
                  </span>
                  {steps[stepIndex].action === 'expand' && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/30 flex items-center gap-1">
                      Evaluating Node · Upper Bound: ₹{steps[stepIndex].activeNode.bound}L
                    </span>
                  )}
                  {steps[stepIndex].action === 'prune' && (
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 font-semibold border border-rose-500/30 flex items-center gap-1">
                      Subtree Pruned · Bound ≤ Current Best (₹{steps[stepIndex].bestProfit}L)
                    </span>
                  )}
                  {steps[stepIndex].action === 'infeasible' && (
                    <span className="px-2 py-0.5 rounded bg-rose-600/20 text-rose-300 font-semibold border border-rose-500/40 flex items-center gap-1">
                      Infeasible Branch · Exceeds Capital Budget
                    </span>
                  )}
                  {steps[stepIndex].action === 'update_best' && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
                      New Incumbent Portfolio Found! (₹{steps[stepIndex].bestProfit}L)
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-amber-400">
                  Level {steps[stepIndex].activeNode.level}/{projects.length}
                </span>
              </div>
            )}

            {/* Status Message Console */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                {statusMessage}
              </p>
            </div>

            {/* Stepping Controls & Speed Presets */}
            {steps.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={stepBackward}
                      disabled={stepIndex === 0}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40"
                      title="Step Backward"
                    >
                      <SkipBack className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsPaused(!isPaused)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center gap-1"
                    >
                      {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                      <span>{isPaused ? 'Resume' : 'Pause'}</span>
                    </button>
                    <button
                      onClick={stepForward}
                      disabled={stepIndex >= steps.length - 1}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40"
                      title="Step Forward"
                    >
                      <SkipForward className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Speed Presets */}
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-slate-400 mr-1">Pace:</span>
                    <button
                      onClick={() => setSpeed(2200)}
                      className={`px-2 py-0.5 rounded border transition-colors ${
                        speed >= 1800
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      Slow / Viva (2.2s)
                    </button>
                    <button
                      onClick={() => setSpeed(1200)}
                      className={`px-2 py-0.5 rounded border transition-colors ${
                        speed >= 800 && speed < 1800
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      Demo (1.2s)
                    </button>
                    <button
                      onClick={() => setSpeed(400)}
                      className={`px-2 py-0.5 rounded border transition-colors ${
                        speed < 800
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      Fast (0.4s)
                    </button>
                  </div>
                </div>

                {/* Slider Control */}
                <div className="flex items-center justify-between gap-3 text-xs text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                  <span className="text-[11px]">Simulation Speed:</span>
                  <input
                    type="range"
                    min="100"
                    max="3000"
                    step="50"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="flex-1 accent-amber-400 cursor-pointer"
                  />
                  <span className="font-mono text-amber-400 tabular-nums text-xs whitespace-nowrap">
                    {speed >= 1000 ? `${(speed / 1000).toFixed(1)}s / step` : `${speed}ms / step`}
                    {speed >= 1500 && <span className="text-emerald-400 ml-1 text-[10px]">(Viva Slow)</span>}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Portfolio Metrics & Tree Bounding Telemetry (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Portfolio Outcomes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <span className="text-xs text-slate-400">Max Achievable Return</span>
                <div className="mt-1 text-2xl font-bold font-mono text-amber-400 tabular-nums">
                  {optimalReturn > 0 ? `₹${optimalReturn}L` : '—'}
                </div>
                <span className="text-[10px] text-slate-500">
                  Capital Used: ₹{optimalCost}L / ₹{budget}L
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <span className="text-xs text-slate-400">Baseline Portfolio</span>
                <div className="mt-1 text-2xl font-bold font-mono text-slate-300 tabular-nums">
                  {baselineReturn > 0 ? `₹${baselineReturn}L` : '—'}
                </div>
                {optimalReturn > baselineReturn && (
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                    <Sparkles className="w-3 h-3" />
                    +₹{optimalReturn - baselineReturn}L optimization gain
                  </span>
                )}
              </div>
            </div>

            {/* Budget Utilization Progress Bar */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="flex justify-between text-xs text-slate-300 pb-2">
                <span>Budget Allocated:</span>
                <span className="font-mono font-semibold text-amber-400">
                  ₹{optimalCost}L / ₹{budget}L ({Math.round((optimalCost / budget) * 100 || 0)}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, (optimalCost / budget) * 100 || 0)}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Remaining: ₹{Math.max(0, budget - optimalCost)} Lakhs</span>
                <span>Unallocated Capital</span>
              </div>
            </div>

            {/* Tree Pruning Statistics */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Branch & Bound Search Tree Performance
              </span>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400">Expanded Nodes</span>
                  <div className="text-lg font-bold font-mono text-amber-400 tabular-nums">
                    {expandedNodes}
                  </div>
                  <span className="text-[10px] text-slate-500">Binary decision states</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400">Pruned Subtrees</span>
                  <div className="text-lg font-bold font-mono text-rose-400 tabular-nums">
                    {prunedNodes}
                  </div>
                  <span className="text-[10px] text-slate-500">Fractional bound cuts</span>
                </div>
              </div>
            </div>

            {/* Pseudocode Walkthrough */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span>FRACTIONAL BOUND PRUNING PSEUDOCODE</span>
                <span className="text-amber-400 font-bold">O(2ⁿ)</span>
              </div>
              <pre className="mt-3 text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">
{`function branchAndBoundKnapsack():
  sort(items, by: value / weight desc)
  PQueue.insert(rootNode)

  while PQueue is not empty:
    node = PQueue.popHighestBound()
    if node.bound <= bestProfit:
      prune(node); continue

    // Branch 1: Include item
    if node.weight + item.cost <= budget:
      childInc = createChild(include: true)
      updateBestIfBetter(childInc)
      PQueue.insert(childInc)

    // Branch 2: Exclude item
    childExc = createChild(include: false)
    if childExc.bound > bestProfit:
      PQueue.insert(childExc)`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
