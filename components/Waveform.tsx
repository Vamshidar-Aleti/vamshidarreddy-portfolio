import React, { useMemo, useState, useEffect } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

interface Signal {
  name: string;
  color: string;
  waveColor: string;
  generateBit: (tick: number) => '0' | '1' | 'X'; // 'X' represents a bug/unknown state
}

const BITS_IN_LOOP = 100;
const BIT_WIDTH_PX = 16;

// A template for signals to separate static config from dynamic state
interface SignalTemplate {
    name: string;
    color: string;
    waveColor: string;
    generateBit: (tick: number, bugTick?: number) => '0' | '1' | 'X';
}

// Define VALID signal logic so it can be reused by the DATA signal
const generateValidBit = (tick: number): '0' | '1' => {
    return (tick > 20 && Math.random() > 0.3 && (tick % 20 < 10) ? '1' : '0');
};

const SIGNAL_TEMPLATES: SignalTemplate[] = [
  { name: 'CLK', color: 'text-cyan-400', waveColor: '#22d3ee', generateBit: (tick) => (tick % 4 < 2 ? '1' : '0') },
  { name: 'RESET_N', color: 'text-red-500', waveColor: '#ef4444', generateBit: (tick) => (tick < 15 ? '0' : '1') }, // Active low reset
  { name: 'VALID', color: 'text-green-400', waveColor: '#4ade80', generateBit: generateValidBit },
  { name: 'DATA[7:0]', color: 'text-orange-400', waveColor: '#fb923c', generateBit: (tick, bugTick) => {
      // Data is only present (high/low/bug) when VALID is high. Otherwise, it's low.
      if (generateValidBit(tick) === '0') {
          return '0';
      }
      
      // If VALID is high, check for bug injection
      if (bugTick !== undefined && tick % BITS_IN_LOOP === bugTick) return 'X';
      
      // If VALID is high and no bug, generate random data
      return Math.random() > 0.5 ? '1' : '0';
    }, 
  },
];

const DATA_SIGNAL_INDEX = SIGNAL_TEMPLATES.findIndex(s => s.name === 'DATA[7:0]');


const generatePathData = (bits: string): { path: string, bugPath: string } => {
  let path = '';
  let bugPath = '';
  let lastY = bits[0] === '1' ? 10 : (bits[0] === '0' ? 30 : 20);
  path += `M 0,${lastY}`;

  for (let i = 0; i < bits.length; i++) {
    const currentBit = bits[i];
    const prevBit = i > 0 ? bits[i - 1] : currentBit;
    
    const x1 = i * BIT_WIDTH_PX;
    const x2 = (i + 1) * BIT_WIDTH_PX;
    
    const y = currentBit === '1' ? 10 : (currentBit === '0' ? 30 : 20); // y=20 for 'X'
    const prevY = prevBit === '1' ? 10 : (prevBit === '0' ? 30 : 20);

    if (currentBit === 'X') {
      // Draw the transition to the bug
      if (prevBit !== 'X') path += ` L ${x1},${prevY}`;
      // Draw the bug segment
      bugPath += `M ${x1},10 L ${x2},30 M ${x1},30 L ${x2},10`;
    } else {
      // Draw transition from a bug state
      if (prevBit === 'X') {
        path += ` M ${x1},${y}`;
      } else if (currentBit !== prevBit) {
        path += ` L ${x1},${prevY} L ${x1},${y}`;
      }
      path += ` L ${x2},${y}`;
    }
  }
  return { path, bugPath };
};


const Waveform: React.FC = () => {
    type BugState = 'IDLE' | 'DETECTED' | 'CORRECTING' | 'FIXED';
    const [bugState, setBugState] = useState<BugState>('IDLE');
    const [bugTick, setBugTick] = useState(55);
    const [manualBugTick, setManualBugTick] = useState(bugTick.toString());
    const [animationKey, setAnimationKey] = useState(0);
    const [isManuallyPaused, setIsManuallyPaused] = useState(false);
    
    // FIX: Explicitly provide HTMLDivElement type to the generic useScrollAnimation hook.
    const [titleRef, isTitleVisible] = useScrollAnimation<HTMLDivElement>();
    // FIX: Explicitly provide HTMLDivElement type to the generic useScrollAnimation hook.
    const [simRef, isSimVisible] = useScrollAnimation<HTMLDivElement>();

    const [signalVisibility, setSignalVisibility] = useState<Record<string, boolean>>(
        SIGNAL_TEMPLATES.reduce((acc, signal) => ({ ...acc, [signal.name]: true }), {})
    );

    const handleSignalClick = (e: React.MouseEvent | React.KeyboardEvent, signalName: string) => {
        e.stopPropagation(); // Prevent the container click from firing
        setSignalVisibility(prev => ({
            ...prev,
            [signalName]: !prev[signalName],
        }));
    };

    const handleInjectBug = () => {
        const newTick = parseInt(manualBugTick, 10);
        if (!isNaN(newTick) && newTick >= 0 && newTick < BITS_IN_LOOP) {
            setBugTick(newTick);
            setAnimationKey(k => k + 1); // Force re-render and animation restart
            setBugState('IDLE');
            setIsManuallyPaused(false); // Ensure simulation plays when new bug is injected
        } else {
            alert(`Please enter a tick number between 0 and ${BITS_IN_LOOP - 1}`);
        }
    };
    
    const handleContainerClick = () => {
        // If unpausing, restart the animation and bug detection cycle to ensure sync.
        if (isManuallyPaused) {
            setAnimationKey(k => k + 1);
            setBugState('IDLE');
        }
        setIsManuallyPaused(prev => !prev);
    };

    const SIGNALS = useMemo<Signal[]>(() => {
        return SIGNAL_TEMPLATES.map(template => ({
            ...template,
            generateBit: (tick: number) => template.generateBit(tick, bugTick),
        }));
    }, [bugTick]);

    const animationDuration = BITS_IN_LOOP * 0.1; // 100ms per bit
    const bugPositionX = (bugTick * BIT_WIDTH_PX) + (BIT_WIDTH_PX / 2);
    
    const scannerDuration = 10; // seconds for one full scan
    const scannerDelay = 1; // initial delay for the scanner animation
    const bugTime = scannerDelay + (bugTick / BITS_IN_LOOP) * scannerDuration;
    
    const visibleSignalsBeforeDataCount = useMemo(() => 
        SIGNAL_TEMPLATES.slice(0, DATA_SIGNAL_INDEX).filter(s => signalVisibility[s.name]).length
    , [signalVisibility]);
    
    const isDataSignalVisible = signalVisibility['DATA[7:0]'];
    const signalRowHeight = 40; // svg height
    const signalRowGap = 16; // from space-y-4 (1rem)
    const bugHighlightTop = visibleSignalsBeforeDataCount * (signalRowHeight + signalRowGap);
    const bugHighlightCenterY = bugHighlightTop + (signalRowHeight / 2);

    useEffect(() => {
        // If manually paused, do not proceed with bug detection timeouts.
        if (isManuallyPaused) {
            return;
        }
        let timer: ReturnType<typeof setTimeout> | undefined;
        if (bugState === 'IDLE') {
            timer = setTimeout(() => setBugState('DETECTED'), bugTime * 1000);
        } else if (bugState === 'DETECTED') {
            timer = setTimeout(() => setBugState('CORRECTING'), 1000); // Wait 1s
        } else if (bugState === 'CORRECTING') {
            timer = setTimeout(() => setBugState('FIXED'), 1500); // Wait 1.5s
        }
        return () => clearTimeout(timer);
    }, [bugState, bugTime, isManuallyPaused]);

    const { initialSignals, correctedDataSignal } = useMemo(() => {
        const initial = SIGNALS.map(signal => {
            const bits = Array.from({ length: BITS_IN_LOOP }, (_, i) => signal.generateBit(i)).join('');
            const { path, bugPath } = generatePathData(bits + bits); // Duplicate for seamless loop
            return { ...signal, path, bugPath };
        });

        const correctedBits = Array.from({ length: BITS_IN_LOOP }, (_, i) => {
          if(generateValidBit(i) === '0') return '0';
          return (Math.random() > 0.5 ? '1' : '0');
        }).join('');
        const { path } = generatePathData(correctedBits + correctedBits);
        const corrected = {
            ...SIGNALS.find(s => s.name === 'DATA[7:0]')!,
            path: path,
            bugPath: '',
        };
        
        return { initialSignals: initial, correctedDataSignal: corrected };
    }, [SIGNALS]);

    const isBugPause = bugState === 'DETECTED' || bugState === 'CORRECTING';
    const isAnimationPaused = isBugPause || isManuallyPaused;
    
    const finalSignalList = initialSignals.map(sig => {
        if (sig.name === 'DATA[7:0]' && (bugState === 'CORRECTING' || bugState === 'FIXED')) {
            return correctedDataSignal;
        }
        return sig;
    });

    return (
        <section className="py-16 md:py-20 bg-black overflow-hidden">
            <div className="container mx-auto px-4">
                <div 
                    ref={titleRef}
                    className={`text-center mb-16 scroll-reveal ${isTitleVisible ? 'scroll-reveal--visible' : ''}`}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Live <span className="gradient-text">Bug Detection</span>
                    </h2>
                    <p className="max-w-3xl mx-auto text-lg text-slate-400">
                        A simulation of automated verification finding, highlighting, and correcting a fault in a digital signal trace. Use the controls to inject a new bug.
                    </p>
                </div>

                <div 
                    ref={simRef}
                    className={`scroll-reveal ${isSimVisible ? 'scroll-reveal--visible' : ''}`}
                >
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                        <label htmlFor="bug-tick-input" className="font-semibold text-slate-300">
                            Set Bug Tick (0-99):
                        </label>
                        <input
                            id="bug-tick-input"
                            type="number"
                            min="0"
                            max={BITS_IN_LOOP - 1}
                            value={manualBugTick}
                            onChange={(e) => setManualBugTick(e.target.value)}
                            className="w-28 bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-center"
                            aria-label="Bug tick input"
                        />
                        <button
                            onClick={handleInjectBug}
                            className="inline-flex items-center justify-center gap-2 bg-slate-800 text-slate-100 font-bold py-2 px-5 rounded-lg hover:bg-slate-700 transition-colors duration-300 border border-slate-700 shadow-md hover:shadow-lg hover:border-orange-500"
                            aria-label="Inject bug and restart simulation"
                        >
                            Inject Bug
                        </button>
                    </div>
                    
                    <div 
                        className="waveform-container bg-black border border-slate-700 rounded-lg p-4 sm:p-6 overflow-hidden relative font-mono cursor-pointer"
                        onClick={handleContainerClick}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleContainerClick(); }}
                        aria-label={isManuallyPaused ? "Resume simulation" : "Pause simulation"}
                    >
                        <div className="waveform-grid absolute inset-0 opacity-50"></div>
                        
                        {isManuallyPaused && (
                            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-40" aria-hidden="true">
                                <svg className="w-16 h-16 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
                                <p className="text-xl font-bold mt-2 text-white">PAUSED</p>
                                <p className="text-sm text-slate-300">Click to resume simulation.</p>
                            </div>
                        )}

                        {/* Timeline Ruler */}
                        <div className="relative z-20 h-6 mb-2 overflow-hidden" key={`ruler-${animationKey}`}>
                            <div
                                className={`waveform-scroll ${isAnimationPaused ? 'paused-animation' : ''}`}
                                style={{ '--wave-width': `${BITS_IN_LOOP * BIT_WIDTH_PX}px`, '--duration': `${animationDuration}s` } as React.CSSProperties}
                            >
                                <svg width={BITS_IN_LOOP * 2 * BIT_WIDTH_PX} height={24} className="block">
                                    <defs>
                                        <pattern id="grid-ruler" x="0" y="0" width={BIT_WIDTH_PX} height="24" patternUnits="userSpaceOnUse">
                                            <line x1="0" y1="18" x2="0" y2="24" stroke="rgb(100 116 139 / 0.7)" strokeWidth="1" />
                                        </pattern>
                                        <pattern id="grid-ruler-10" x="0" y="0" width={BIT_WIDTH_PX * 10} height="24" patternUnits="userSpaceOnUse">
                                            <line x1="0" y1="10" x2="0" y2="24" stroke="rgb(100 116 139)" strokeWidth="1" />
                                        </pattern>
                                    </defs>
                                    <rect x="0" y="0" width="100%" height="24" fill="url(#grid-ruler)" />
                                    <rect x="0" y="0" width="100%" height="24" fill="url(#grid-ruler-10)" />
                                    {Array.from({ length: BITS_IN_LOOP * 2 / 10 }).map((_, i) => (
                                        <text
                                            key={i}
                                            x={i * 10 * BIT_WIDTH_PX + 4}
                                            y="14"
                                            className="text-xs fill-slate-400"
                                        >
                                            {i * 10}
                                        </text>
                                    ))}
                                </svg>
                            </div>
                        </div>

                        {/* Scanner Bar and Bug Highlight */}
                        <div className="absolute top-0 left-0 h-full w-full z-20 pointer-events-none">
                            <div key={`scanner-${animationKey}`} className={`scanner-bar absolute top-0 w-1 h-full bg-cyan-400/50 shadow-[0_0_15px_2px_theme(colors.cyan.400)] ${isAnimationPaused ? 'paused-animation' : ''}`}></div>
                            
                            <div
                                className="absolute top-0 h-full"
                                style={{ left: `${bugPositionX}px` }}
                            >
                              {/* Highlight Rendering Logic */}
                              {isDataSignalVisible && (bugState === 'DETECTED' || bugState === 'CORRECTING') && (
                                  <div
                                      className={`absolute rounded-full w-10 h-10 bg-red-500/20 ${bugState === 'CORRECTING' ? 'bug-highlight-fading' : 'bug-highlight'}`}
                                      style={{
                                          top: `${bugHighlightCenterY}px`,
                                          transform: 'translate(-50%, -50%)'
                                      }}
                                  ></div>
                              )}

                              {/* Message Rendering Logic */}
                              {isDataSignalVisible && bugState === 'DETECTED' && (
                                  <div
                                      className="bug-message absolute w-max p-2 text-sm font-semibold text-red-300 bg-red-900/80 border border-red-500 rounded-md shadow-lg"
                                      style={{
                                          top: `${bugHighlightCenterY - 45}px`,
                                          transform: 'translateX(-50%)'
                                      }}
                                  >
                                      BUG DETECTED
                                  </div>
                              )}
                              {isDataSignalVisible && bugState === 'CORRECTING' && (
                                  <div className="absolute w-max p-2 text-sm font-semibold text-green-300 bg-green-900/80 border border-green-500 rounded-md shadow-lg" style={{
                                      top: `${bugHighlightCenterY - 45}px`,
                                      transform: 'translateX(-50%)',
                                      animation: 'fade-in 0.3s ease-out forwards'
                                  }}>
                                      BUG CORRECTED
                                  </div>
                              )}
                            </div>
                        </div>

                        <div className="relative z-10 space-y-4">
                            {finalSignalList.map(({ name, color, waveColor, path, bugPath }) => (
                                <div key={name} className={`flex items-center gap-4 ${!signalVisibility[name] ? 'signal-row-hidden' : ''}`}>
                                    <div 
                                        className="w-32 flex-shrink-0 cursor-pointer group"
                                        onClick={(e) => handleSignalClick(e, name)}
                                        aria-label={`Toggle visibility of ${name} signal`}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSignalClick(e, name); }}
                                    >
                                        <p className={`text-sm font-bold truncate transition-opacity ${color} ${!signalVisibility[name] ? 'opacity-50' : 'group-hover:text-white'}`}>{name}</p>
                                    </div>
                                    <div className="flex-grow overflow-hidden waveform-wrapper">
                                        <div 
                                            key={`${name}-${animationKey}`}
                                            className={`waveform-scroll ${isAnimationPaused ? 'paused-animation' : ''}`}
                                            style={{ '--wave-width': `${BITS_IN_LOOP * BIT_WIDTH_PX}px`, '--duration': `${animationDuration}s` } as React.CSSProperties}
                                        >
                                            <svg width={BITS_IN_LOOP * 2 * BIT_WIDTH_PX} height={40} className="block">
                                                <path d={path} stroke={waveColor} strokeWidth="2" fill="none" />
                                                {bugPath && <path d={bugPath} stroke="#ef4444" strokeWidth="2.5" fill="none" />}
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Waveform;