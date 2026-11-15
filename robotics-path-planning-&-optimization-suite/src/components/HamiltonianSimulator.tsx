import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Cpu,
  CheckCircle,
  XCircle,
  Zap,
  Info,
  GitBranch,
} from 'lucide-react';
import {
  DEFAULT_PCB_GRAPH,
  DISCONNECTED_PCB_GRAPH,
  findHamiltonianCycle,
} from '../algorithms/hamiltonian';
import { GraphNode, HamiltonianStep } from '../types';

interface HamiltonianSimulatorProps {
  onUpdateStats?: (stats: { found: boolean; sequence: string; explored: number }) => void;
}

const PCB_NODES: GraphNode[] = [
  { id: '0', label: 'Component A', x: 200, y: 60 },
  { id: '1', label: 'Component B', x: 330, y: 120 },
  { id: '2', label: 'Component C', x: 330, y: 260 },
  { id: '3', label: 'Component D', x: 200, y: 320 },
  { id: '4', label: 'Component E', x: 70, y: 260 },
  { id: '5', label: 'Component F', x: 70, y: 120 },
];

export const HamiltonianSimulator: React.FC<HamiltonianSimulatorProps> = ({ onUpdateStats }) => {
  const [adjMatrix, setAdjMatrix] = useState<number[][]>(DEFAULT_PCB_GRAPH);
  const [startVertex, setStartVertex] = useState<number>(0);
  const [selectedNodeForEdge, setSelectedNodeForEdge] = useState<number | null>(null);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [steps, setSteps] = useState<HamiltonianStep[]>([]);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1000); // 1.0s default presentation speed
  const [cycleFound, setCycleFound] = useState<boolean | null>(null);
  const [cycleSequence, setCycleSequence] = useState<string>('');
  const [exploredCount, setExploredCount] = useState<number>(0);
  const [rejectedCount, setRejectedCount] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>(
    'Select a starting component and click "Find Hamiltonian Cycle", or click nodes/matrix to edit traces.'
  );

  const timerRef = useRef<number | null>(null);
  const V = PCB_NODES.length;

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSolving(false);
    setIsPaused(false);
    setSteps([]);
    setStepIndex(0);
    setCycleFound(null);
    setCycleSequence('');
    setExploredCount(0);
    setRejectedCount(0);
    setSelectedNodeForEdge(null);
    setStatusMessage('PCB circuit state reset. Ready for simulation.');
  };

  const handleRunAlgorithm = () => {
    handleReset();
    const result = findHamiltonianCycle(
      adjMatrix,
      startVertex,
      PCB_NODES.map((n) => n.label.replace('Component ', ''))
    );

    setSteps(result.steps);
    setExploredCount(result.exploredStates);
    setRejectedCount(result.rejectedStates);
    setCycleFound(result.cycleFound);

    const seq = result.cycleFound
      ? result.cycle.map((v) => PCB_NODES[v].label.replace('Component ', '')).join(' → ')
      : 'No Cycle Found';
    setCycleSequence(seq);

    setIsSolving(true);
    setIsPaused(false);
    setStepIndex(0);

    if (onUpdateStats) {
      onUpdateStats({
        found: result.cycleFound,
        sequence: seq,
        explored: result.exploredStates,
      });
    }
  };

  // Stepping animation
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

  // Matrix cell toggle
  const toggleMatrixEdge = (i: number, j: number) => {
    if (i === j) return;
    const newMatrix = adjMatrix.map((row) => [...row]);
    const newVal = newMatrix[i][j] === 1 ? 0 : 1;
    newMatrix[i][j] = newVal;
    newMatrix[j][i] = newVal; // Undirected graph
    setAdjMatrix(newMatrix);
    handleReset();
  };

  // Node click to toggle edge between two nodes
  const handleNodeClick = (nodeIdx: number) => {
    if (isSolving) return;
    if (selectedNodeForEdge === null) {
      setSelectedNodeForEdge(nodeIdx);
      setStatusMessage(`Selected ${PCB_NODES[nodeIdx].label}. Click another component to toggle conductive trace.`);
    } else {
      if (selectedNodeForEdge !== nodeIdx) {
        toggleMatrixEdge(selectedNodeForEdge, nodeIdx);
        setStatusMessage(
          `Toggled trace between ${PCB_NODES[selectedNodeForEdge].label} and ${PCB_NODES[nodeIdx].label}.`
        );
      }
      setSelectedNodeForEdge(null);
    }
  };

  // Current active path from steps
  const activePath = steps.length > 0 && steps[stepIndex] ? steps[stepIndex].currentPath.filter((v) => v !== -1) : [];
  const rejectedEdge = steps.length > 0 && steps[stepIndex] ? steps[stepIndex].rejectedEdge : undefined;
  const isCompleteCycle = steps.length > 0 && steps[stepIndex]?.action === 'complete';

  return (
    <section id="hamiltonian" className="py-20 border-b border-slate-800/60 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Algorithm 2 · Backtracking
          </div>
          <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Optimizing Circuit Connectivity Using the Hamiltonian Cycle Algorithm
          </h2>
          <p className="mt-4 text-xs sm:text-base text-slate-300 leading-relaxed">
            On high-density circuit boards, determining whether a continuous conductive bus can sequentially
            traverse all microchips ($V$) exactly once and return to the starting IC without duplicating paths
            is modeled as finding a Hamiltonian Cycle. Backtracking explores valid trace choices and retreats
            when reaching an isolated component or closed loop premature dead-end.
          </p>
        </div>

        {/* Toolbar & Presets */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Circuit Presets:</span>
            <button
              onClick={() => {
                setAdjMatrix(DEFAULT_PCB_GRAPH);
                handleReset();
              }}
              className="px-3 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Standard Valid PCB
            </button>
            <button
              onClick={() => {
                setAdjMatrix(DISCONNECTED_PCB_GRAPH);
                handleReset();
              }}
              className="px-3 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Disconnected Loop (No Cycle)
            </button>
            <button
              onClick={() => {
                setAdjMatrix(Array.from({ length: 6 }, (_, i) => Array.from({ length: 6 }, (_, j) => (i === j ? 0 : 1))));
                handleReset();
              }}
              className="px-3 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Complete Mesh
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Start IC:</span>
              <select
                value={startVertex}
                onChange={(e) => {
                  setStartVertex(Number(e.target.value));
                  handleReset();
                }}
                disabled={isSolving}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 focus:ring-1 focus:ring-emerald-400"
              >
                {PCB_NODES.map((n, idx) => (
                  <option key={n.id} value={idx}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleRunAlgorithm}
              disabled={isSolving && !isPaused}
              className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              Find Hamiltonian Cycle
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Reset Circuit"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Simulator Grid Layout */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive SVG Circuit Board (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs text-slate-400">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  PCB Schematic Canvas
                </span>
                <span className="text-[11px] text-slate-400">Click any 2 ICs to toggle traces</span>
              </div>

              {/* Circuit Board SVG */}
              <div className="mt-4 flex justify-center">
                <svg viewBox="0 0 400 380" className="w-full max-w-[420px] h-auto select-none">
                  {/* Subtle PCB Grid Lines */}
                  <defs>
                    <pattern id="pcbGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                    </pattern>
                    <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <rect x="10" y="10" width="380" height="360" rx="16" fill="#020617" stroke="#1e293b" strokeWidth="1.5" />
                  <rect x="10" y="10" width="380" height="360" fill="url(#pcbGrid)" opacity="0.6" />

                  {/* Edges / Traces */}
                  {PCB_NODES.map((fromNode, i) =>
                    PCB_NODES.map((toNode, j) => {
                      if (i >= j || adjMatrix[i][j] === 0) return null;

                      // Check if edge is in active path
                      let isActive = false;
                      let isCycleClosure = false;

                      for (let p = 0; p < activePath.length - 1; p++) {
                        if (
                          (activePath[p] === i && activePath[p + 1] === j) ||
                          (activePath[p] === j && activePath[p + 1] === i)
                        ) {
                          isActive = true;
                          break;
                        }
                      }

                      // Check if rejected
                      const isRejected =
                        rejectedEdge &&
                        ((rejectedEdge[0] === i && rejectedEdge[1] === j) ||
                          (rejectedEdge[0] === j && rejectedEdge[1] === i));

                      const strokeColor = isCompleteCycle && isActive
                        ? '#10b981' // emerald
                        : isActive
                        ? '#06b6d4' // cyan
                        : isRejected
                        ? '#f43f5e' // red
                        : '#334155'; // default slate trace

                      const strokeWidth = isActive || isRejected ? 3.5 : 1.5;

                      return (
                        <g key={`edge-${i}-${j}`}>
                          <line
                            x1={fromNode.x}
                            y1={fromNode.y}
                            x2={toNode.x}
                            y2={toNode.y}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            strokeDasharray={isRejected ? '4 4' : undefined}
                            filter={isActive && isCompleteCycle ? 'url(#emeraldGlow)' : undefined}
                            className="transition-all duration-300"
                          />
                        </g>
                      );
                    })
                  )}

                  {/* Component Nodes (IC Chips) */}
                  {PCB_NODES.map((node, idx) => {
                    const isInPath = activePath.includes(idx);
                    const isStart = idx === startVertex;
                    const isSelected = selectedNodeForEdge === idx;
                    const isCurrentHead = activePath.length > 0 && activePath[activePath.length - 1] === idx;

                    return (
                      <g
                        key={node.id}
                        onClick={() => handleNodeClick(idx)}
                        className="cursor-pointer group"
                      >
                        {/* Outer Glow / Ring */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="22"
                          fill="#0f172a"
                          stroke={
                            isSelected
                              ? '#f59e0b'
                              : isCompleteCycle && isInPath
                              ? '#10b981'
                              : isCurrentHead
                              ? '#06b6d4'
                              : isInPath
                              ? '#0284c7'
                              : '#334155'
                          }
                          strokeWidth={isCurrentHead || isSelected ? 3 : 2}
                          filter={isInPath ? 'url(#emeraldGlow)' : undefined}
                          className="transition-all duration-200"
                        />

                        {/* IC Chip Core Rectangle */}
                        <rect
                          x={node.x - 12}
                          y={node.y - 12}
                          width="24"
                          height="24"
                          rx="4"
                          fill={isStart ? '#06b6d4' : '#1e293b'}
                          stroke="#475569"
                          strokeWidth="1"
                        />

                        {/* Node Label Text */}
                        <text
                          x={node.x}
                          y={node.y + 4}
                          textAnchor="middle"
                          fill={isStart ? '#020617' : '#f8fafc'}
                          fontSize="11"
                          fontWeight="bold"
                          className="font-mono"
                        >
                          {node.label.replace('Component ', '')}
                        </text>

                        {/* Subtext Label below node */}
                        <text
                          x={node.x}
                          y={node.y + 36}
                          textAnchor="middle"
                          fill="#94a3b8"
                          fontSize="9"
                          fontWeight="500"
                        >
                          {node.label}
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
                    {steps[stepIndex].action === 'visit' && (
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/30 flex items-center gap-1">
                        Trace Extended to Component {PCB_NODES[steps[stepIndex].vertex]?.label.replace('Component ', '')}
                      </span>
                    )}
                    {steps[stepIndex].action === 'reject' && (
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 font-semibold border border-rose-500/30 flex items-center gap-1">
                        Rejected Move · No Trace or Already Visited
                      </span>
                    )}
                    {steps[stepIndex].action === 'backtrack' && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/30 flex items-center gap-1">
                        Dead-End · Backtracking Junction
                      </span>
                    )}
                    {steps[stepIndex].action === 'complete' && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
                        Hamiltonian Cycle Closed!
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">
                    Path Length {activePath.length}/6
                  </span>
                </div>
              )}

              {/* Status Message Console */}
              <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
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
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs flex items-center gap-1"
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
                        onClick={() => setSpeed(2000)}
                        className={`px-2 py-0.5 rounded border transition-colors ${
                          speed >= 1600
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-semibold'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        Slow / Viva (2.0s)
                      </button>
                      <button
                        onClick={() => setSpeed(1000)}
                        className={`px-2 py-0.5 rounded border transition-colors ${
                          speed >= 750 && speed < 1600
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-semibold'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        Demo (1.0s)
                      </button>
                      <button
                        onClick={() => setSpeed(350)}
                        className={`px-2 py-0.5 rounded border transition-colors ${
                          speed < 750
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-semibold'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        Fast (0.35s)
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
                      className="flex-1 accent-emerald-400 cursor-pointer"
                    />
                    <span className="font-mono text-emerald-400 tabular-nums text-xs whitespace-nowrap">
                      {speed >= 1000 ? `${(speed / 1000).toFixed(1)}s / step` : `${speed}ms / step`}
                      {speed >= 1400 && <span className="text-emerald-300 ml-1 text-[10px]">(Viva Slow)</span>}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Adjacency Matrix & Metrics (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <span className="text-xs text-slate-400">Cycle Status</span>
                <div className="mt-1 flex items-center gap-2">
                  {cycleFound === true ? (
                    <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Loop Verified
                    </span>
                  ) : cycleFound === false ? (
                    <span className="text-sm font-semibold text-rose-400 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> No Cycle
                    </span>
                  ) : (
                    <span className="text-sm text-slate-500 font-mono">Idle</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 truncate block mt-0.5">
                  {cycleSequence || 'Awaiting execution'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <span className="text-xs text-slate-400">Explored States</span>
                <div className="mt-1 text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                  {exploredCount}
                </div>
                <span className="text-[10px] text-slate-500">Rejected moves: {rejectedCount}</span>
              </div>
            </div>

            {/* Interactive Adjacency Matrix */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span>CONDUCTIVITY ADJACENCY MATRIX (6x6)</span>
                <span className="text-emerald-400 font-semibold">Click 0/1 to toggle</span>
              </div>

              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-center text-xs font-mono">
                  <thead>
                    <tr>
                      <th className="p-1 text-slate-500"></th>
                      {['A', 'B', 'C', 'D', 'E', 'F'].map((c) => (
                        <th key={c} className="p-1 text-cyan-400 font-semibold">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {adjMatrix.map((row, i) => (
                      <tr key={`matrix-row-${i}`}>
                        <td className="p-1 text-cyan-400 font-semibold">
                          {['A', 'B', 'C', 'D', 'E', 'F'][i]}
                        </td>
                        {row.map((val, j) => (
                          <td key={`matrix-cell-${i}-${j}`} className="p-0.5">
                            <button
                              onClick={() => toggleMatrixEdge(i, j)}
                              disabled={i === j || isSolving}
                              className={`w-7 h-7 rounded text-xs transition-colors font-mono ${
                                i === j
                                  ? 'bg-slate-950 text-slate-600 cursor-not-allowed'
                                  : val === 1
                                  ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40 hover:bg-emerald-500/30'
                                  : 'bg-slate-950 text-slate-500 border border-slate-800 hover:bg-slate-800'
                              }`}
                            >
                              {val}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pseudocode & Academic Clarity */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span>HAMILTONIAN BACKTRACKING LOGIC</span>
                <span className="text-emerald-400 font-bold">O(V!)</span>
              </div>
              <pre className="mt-3 text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">
{`function hamiltonian(path, pos):
  if pos == V:
    return adjMatrix[path[V-1]][path[0]] == 1

  for v from 0 to V-1:
    if isValidMove(v, path, pos):
      path[pos] = v
      if hamiltonian(path, pos + 1):
        return true
      path[pos] = -1 // Backtrack

  return false`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
