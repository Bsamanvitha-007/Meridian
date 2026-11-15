import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Plane,
  CheckCircle,
  XCircle,
  TrendingDown,
  Info,
  MapPin,
  Edit3,
} from 'lucide-react';
import {
  DEFAULT_AIRPORTS,
  DEFAULT_TSP_MATRIX,
  solveTSPBranchAndBound,
  calculatePathCost,
} from '../algorithms/tspBranchAndBound';
import { Airport, TSPNode, TSPStep } from '../types';

interface TSPSimulatorProps {
  onUpdateStats?: (stats: { optimalCost: number; baselineCost: number; expanded: number; pruned: number }) => void;
}

export const TSPSimulator: React.FC<TSPSimulatorProps> = ({ onUpdateStats }) => {
  const [airports] = useState<Airport[]>(DEFAULT_AIRPORTS);
  const [costMatrix, setCostMatrix] = useState<number[][]>(DEFAULT_TSP_MATRIX);
  const [startAirport, setStartAirport] = useState<number>(0);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1200); // 1.2s default presentation pace
  const [steps, setSteps] = useState<TSPStep[]>([]);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [optimalCost, setOptimalCost] = useState<number | null>(null);
  const [optimalPath, setOptimalPath] = useState<number[]>([]);
  const [baselineCost, setBaselineCost] = useState<number | null>(null);
  const [baselinePath, setBaselinePath] = useState<number[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<number>(0);
  const [prunedNodes, setPrunedNodes] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>(
    'Select a dispatch hub and click "Find Optimal Cargo Route" to execute Branch & Bound.'
  );

  const [editMatrixMode, setEditMatrixMode] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSolving(false);
    setIsPaused(false);
    setSteps([]);
    setStepIndex(0);
    setOptimalCost(null);
    setOptimalPath([]);
    setBaselineCost(null);
    setBaselinePath([]);
    setExpandedNodes(0);
    setPrunedNodes(0);
    setStatusMessage('Cargo route planner reset. Ready for computation.');
  };

  const handleRunAlgorithm = () => {
    handleReset();
    const result = solveTSPBranchAndBound(costMatrix, startAirport, airports);

    setSteps(result.steps);
    setOptimalCost(result.optimalCost);
    setOptimalPath(result.optimalPath);
    setBaselineCost(result.baselineCost);
    setBaselinePath(result.baselinePath);
    setExpandedNodes(result.expandedNodes);
    setPrunedNodes(result.prunedNodes);

    setIsSolving(true);
    setIsPaused(false);
    setStepIndex(0);

    if (onUpdateStats) {
      onUpdateStats({
        optimalCost: result.optimalCost,
        baselineCost: result.baselineCost,
        expanded: result.expandedNodes,
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

  // Matrix cell update with symmetry enforcement
  const updateMatrixCell = (i: number, j: number, value: string) => {
    const num = Math.max(0, parseInt(value) || 0);
    const newM = costMatrix.map((row) => [...row]);
    newM[i][j] = num;
    newM[j][i] = num; // Maintain symmetry
    setCostMatrix(newM);
    handleReset();
  };

  // Current partial path being evaluated
  const currentStep = steps[stepIndex];
  const activePath = currentStep ? currentStep.activeNode.path : [];
  const currentBestPath = currentStep ? currentStep.currentBestPath : optimalPath;
  const currentBestCost = currentStep ? currentStep.currentBestCost : optimalCost;

  return (
    <section id="tsp" className="py-20 border-b border-slate-800/60 bg-slate-950/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Algorithm 3 · Branch and Bound
          </div>
          <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Airline Cargo Route Optimization Using Branch and Bound
          </h2>
          <p className="mt-4 text-xs sm:text-base text-slate-300 leading-relaxed">
            A freight air carrier must dispatch cargo aircraft from an origin airport, deliver packages
            to all metropolitan hubs, and return to base while minimizing total fuel expenditure and flight hours.
            Branch and Bound maintains an incumbent best tour and computes an admissible Minimum Spanning Tree (MST)
            lower bound, aggressively pruning subtrees that cannot beat the current optimum.
          </p>
        </div>

        {/* Action Bar & Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Origin Hub:</span>
            <select
              value={startAirport}
              onChange={(e) => {
                setStartAirport(Number(e.target.value));
                handleReset();
              }}
              disabled={isSolving}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-400"
            >
              {airports.map((a, idx) => (
                <option key={a.id} value={idx}>
                  {a.name} ({a.code})
                </option>
              ))}
            </select>

            <button
              onClick={() => setEditMatrixMode(!editMatrixMode)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors flex items-center gap-1.5 ${
                editMatrixMode
                  ? 'bg-blue-950 text-blue-300 border-blue-700'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{editMatrixMode ? 'Hide Matrix Editor' : 'Edit Cost Matrix'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunAlgorithm}
              disabled={isSolving && !isPaused}
              className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-blue-400 hover:bg-blue-300 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              Find Optimal Cargo Route
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Reset Route Planner"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Optional Editable Cost Matrix Panel */}
        {editMatrixMode && (
          <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono text-slate-400">
              <span>SYMMETRIC ROUTE EXPENSE MATRIX (ILLUSTRATIVE FUEL UNITS)</span>
              <button
                onClick={() => {
                  setCostMatrix(DEFAULT_TSP_MATRIX);
                  handleReset();
                }}
                className="text-blue-400 hover:underline"
              >
                Reset to Default Matrix
              </button>
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-center text-xs font-mono">
                <thead>
                  <tr>
                    <th className="p-1 text-slate-500"></th>
                    {airports.map((a) => (
                      <th key={a.code} className="p-1 text-blue-400 font-semibold">
                        {a.code}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {costMatrix.map((row, i) => (
                    <tr key={`cost-row-${i}`}>
                      <td className="p-1 text-blue-400 font-semibold">{airports[i].code}</td>
                      {row.map((val, j) => (
                        <td key={`cost-cell-${i}-${j}`} className="p-0.5">
                          <input
                            type="number"
                            min="0"
                            max="99"
                            disabled={i === j || isSolving}
                            value={val}
                            onChange={(e) => updateMatrixCell(i, j, e.target.value)}
                            className={`w-12 text-center py-1 rounded bg-slate-950 border text-xs font-mono ${
                              i === j
                                ? 'text-slate-600 border-slate-900 cursor-not-allowed'
                                : 'text-slate-200 border-slate-800 focus:border-blue-400'
                            }`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Main Stage Grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Airport Route Network SVG (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs text-slate-400">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Plane className="w-4 h-4 text-blue-400" />
                  Indian Metropolitan Cargo Hub Network
                </span>
                <span className="text-[11px] text-slate-400">Illustrative Flight Corridors</span>
              </div>

              {/* Map SVG Canvas */}
              <div className="mt-4 flex justify-center">
                <svg viewBox="0 0 360 400" className="w-full max-w-[380px] h-auto select-none">
                  <defs>
                    <linearGradient id="mapBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0f172a" />
                      <stop offset="100%" stopColor="#020617" />
                    </linearGradient>
                    <filter id="blueGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Indian Subcontinent Stylized Backdrop Silhouette */}
                  <path
                    d="M 120 40 Q 190 20 220 50 L 250 120 Q 280 180 260 270 L 200 370 L 150 330 Q 100 260 110 180 Z"
                    fill="url(#mapBgGrad)"
                    stroke="#1e293b"
                    strokeWidth="1.5"
                    opacity="0.8"
                  />

                  {/* Flight Corridors (All possible routes) */}
                  {airports.map((fromA, i) =>
                    airports.map((toA, j) => {
                      if (i >= j) return null;
                      const cost = costMatrix[i][j];

                      // Check if route is in optimal tour
                      let isOptimal = false;
                      if (optimalPath.length > 0) {
                        for (let p = 0; p < optimalPath.length - 1; p++) {
                          if (
                            (optimalPath[p] === i && optimalPath[p + 1] === j) ||
                            (optimalPath[p] === j && optimalPath[p + 1] === i)
                          ) {
                            isOptimal = true;
                            break;
                          }
                        }
                      }

                      // Check if route is in active search path
                      let isActive = false;
                      for (let p = 0; p < activePath.length - 1; p++) {
                        if (
                          (activePath[p] === i && activePath[p + 1] === j) ||
                          (activePath[p] === j && activePath[p + 1] === i)
                        ) {
                          isActive = true;
                          break;
                        }
                      }

                      const strokeColor = isOptimal
                        ? '#10b981' // Green optimal tour
                        : isActive
                        ? '#38bdf8' // Cyan active search
                        : '#1e293b'; // Default corridor

                      const strokeWidth = isOptimal ? 3 : isActive ? 2.5 : 1;
                      const midX = (fromA.x + toA.x) / 2;
                      const midY = (fromA.y + toA.y) / 2;

                      return (
                        <g key={`corridor-${i}-${j}`}>
                          <line
                            x1={fromA.x}
                            y1={fromA.y}
                            x2={toA.x}
                            y2={toA.y}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            strokeDasharray={!isOptimal && !isActive ? '3 3' : undefined}
                            filter={isOptimal ? 'url(#blueGlow)' : undefined}
                          />
                          {/* Cost Label */}
                          <rect
                            x={midX - 10}
                            y={midY - 7}
                            width="20"
                            height="14"
                            rx="3"
                            fill="#020617"
                            stroke="#334155"
                            strokeWidth="0.5"
                          />
                          <text
                            x={midX}
                            y={midY + 3.5}
                            textAnchor="middle"
                            fill={isOptimal ? '#10b981' : '#94a3b8'}
                            fontSize="8"
                            fontWeight="bold"
                            className="font-mono"
                          >
                            {cost}
                          </text>
                        </g>
                      );
                    })
                  )}

                  {/* Airport Hub Nodes */}
                  {airports.map((airport, idx) => {
                    const isOrigin = idx === startAirport;
                    const isInActivePath = activePath.includes(idx);
                    const isInOptimal = optimalPath.includes(idx);

                    return (
                      <g key={airport.id} className="cursor-pointer">
                        {/* Pulse Ring if in active search */}
                        <circle
                          cx={airport.x}
                          cy={airport.y}
                          r={isOrigin ? 18 : 14}
                          fill="#0f172a"
                          stroke={
                            isOrigin
                              ? '#38bdf8'
                              : isInOptimal
                              ? '#10b981'
                              : isInActivePath
                              ? '#06b6d4'
                              : '#475569'
                          }
                          strokeWidth={isOrigin ? 3 : 2}
                        />

                        {/* Airport Code Badge */}
                        <text
                          x={airport.x}
                          y={airport.y + 3.5}
                          textAnchor="middle"
                          fill={isOrigin ? '#38bdf8' : isInOptimal ? '#10b981' : '#f8fafc'}
                          fontSize="8"
                          fontWeight="bold"
                          className="font-mono"
                        >
                          {airport.code}
                        </text>

                        {/* City Label */}
                        <text
                          x={airport.x}
                          y={airport.y + 24}
                          textAnchor="middle"
                          fill="#cbd5e1"
                          fontSize="9"
                          fontWeight="500"
                        >
                          {airport.name.replace(' Airport', '')}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Active Step Action Callout Banner */}
              {steps.length > 0 && steps[stepIndex] && (
                <div className="mt-4 p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all bg-slate-950/90 border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 text-[11px]">
                      Step {stepIndex + 1}/{steps.length}:
                    </span>
                    {steps[stepIndex].action === 'expand' && (
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-semibold border border-blue-500/30 flex items-center gap-1">
                        Expanding Branch · MST Bound: {steps[stepIndex].activeNode.bound}
                      </span>
                    )}
                    {steps[stepIndex].action === 'prune' && (
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 font-semibold border border-rose-500/30 flex items-center gap-1">
                        Subtree Pruned · Bound Cannot Beat Best
                      </span>
                    )}
                    {steps[stepIndex].action === 'update_best' && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
                        New Optimal Cargo Route Found!
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-blue-400">
                    Queue Size {steps[stepIndex].queueSize}
                  </span>
                </div>
              )}

              {/* Status Message Console */}
              <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  {statusMessage}
                </p>
              </div>

              {/* Stepping Controls & Speed Presets */}
              {steps.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
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
                        className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-slate-950 font-semibold text-xs flex items-center gap-1"
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
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 font-semibold'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        Slow / Viva (2.2s)
                      </button>
                      <button
                        onClick={() => setSpeed(1200)}
                        className={`px-2 py-0.5 rounded border transition-colors ${
                          speed >= 800 && speed < 1800
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 font-semibold'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        Demo (1.2s)
                      </button>
                      <button
                        onClick={() => setSpeed(400)}
                        className={`px-2 py-0.5 rounded border transition-colors ${
                          speed < 800
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 font-semibold'
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
                      className="flex-1 accent-blue-400 cursor-pointer"
                    />
                    <span className="font-mono text-blue-400 tabular-nums text-xs whitespace-nowrap">
                      {speed >= 1000 ? `${(speed / 1000).toFixed(1)}s / step` : `${speed}ms / step`}
                      {speed >= 1500 && <span className="text-emerald-400 ml-1 text-[10px]">(Viva Slow)</span>}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Branch & Bound Telemetry Deck (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <span className="text-xs text-slate-400">Optimal Tour Cost</span>
                <div className="mt-1 text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                  {optimalCost !== null ? `${optimalCost} Units` : '—'}
                </div>
                <span className="text-[10px] text-slate-500">
                  {optimalPath.length > 0
                    ? optimalPath.map((idx) => airports[idx].code).join(' → ')
                    : 'Awaiting execution'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <span className="text-xs text-slate-400">Baseline Tour</span>
                <div className="mt-1 text-2xl font-bold font-mono text-slate-300 tabular-nums">
                  {baselineCost !== null ? `${baselineCost} Units` : '—'}
                </div>
                {baselineCost && optimalCost && (
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                    <TrendingDown className="w-3 h-3" />
                    Saved {baselineCost - optimalCost} units ({Math.round(((baselineCost - optimalCost) / baselineCost) * 100)}%)
                  </span>
                )}
              </div>
            </div>

            {/* Tree Pruning Statistics */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                State-Space Tree Pruning Metrics
              </span>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400">Expanded States</span>
                  <div className="text-lg font-bold font-mono text-blue-400 tabular-nums">
                    {expandedNodes}
                  </div>
                  <span className="text-[10px] text-slate-500">Nodes explored</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400">Pruned Branches</span>
                  <div className="text-lg font-bold font-mono text-rose-400 tabular-nums">
                    {prunedNodes}
                  </div>
                  <span className="text-[10px] text-slate-500">Subtrees clipped</span>
                </div>
              </div>
            </div>

            {/* Current Search State Breakdown */}
            {currentStep && (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-blue-900/40 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold text-blue-300">Active Priority Queue Node:</span>
                  <span className="font-mono text-slate-400">Node #{currentStep.nodeId}</span>
                </div>
                <div className="font-mono text-slate-300">
                  Path: {currentStep.activeNode.path.map((idx) => airports[idx].code).join(' → ')}
                </div>
                <div className="flex justify-between font-mono text-slate-400 pt-1 border-t border-slate-800">
                  <span>Partial Cost: {currentStep.activeNode.cost}</span>
                  <span className="text-blue-400">MST Lower Bound: {currentStep.activeNode.bound}</span>
                </div>
              </div>
            )}

            {/* Pseudocode Walkthrough */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span>BRANCH AND BOUND TSP (PRIORITY QUEUE)</span>
                <span className="text-blue-400 font-bold">O(n!)</span>
              </div>
              <pre className="mt-3 text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">
{`function branchAndBoundTSP():
  PQueue.insert(rootNode)
  bestCost = Infinity

  while PQueue is not empty:
    node = PQueue.popSmallestBound()
    if node.bound >= bestCost:
      prune(node); continue

    for each unvisited city u:
      child = extend(node, u)
      child.bound = calcMSTLowerBound(child)
      if child.isComplete():
        bestCost = min(bestCost, child.cost)
      else if child.bound < bestCost:
        PQueue.insert(child)`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
