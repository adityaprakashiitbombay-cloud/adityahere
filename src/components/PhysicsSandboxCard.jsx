import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Zap, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PhysicsSandboxCard({ playClickSound }) {
  const canvasRef = useRef(null);

  // Simulation Parameters state
  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(30);
  const [gravity, setGravity] = useState(9.8);

  // Interactive Target
  const [targetDistance, setTargetDistance] = useState(80);
  const [hasHitTarget, setHasHitTarget] = useState(false);

  // Animated projectile values
  const [isSimulating, setIsSimulating] = useState(false);
  const [simTime, setSimTime] = useState(0);

  // Physics Calculations
  const angleRad = (angle * Math.PI) / 180;
  const range = (Math.pow(velocity, 2) * Math.sin(2 * angleRad)) / gravity;
  const maxHeight = (Math.pow(velocity, 2) * Math.pow(Math.sin(angleRad), 2)) / (2 * gravity);
  const timeOfFlight = (2 * velocity * Math.sin(angleRad)) / gravity;

  // Real-time canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const padding = 20;
    const scaleX = (width - padding * 2) / 140;
    const scaleY = (height - padding * 2) / 70;

    // Ground Line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    for (let x = 20; x < 120; x += 20) {
      const px = padding + x * scaleX;
      ctx.beginPath();
      ctx.moveTo(px, padding);
      ctx.lineTo(px, height - padding);
      ctx.stroke();
    }

    // Target on ground
    const targetPx = padding + targetDistance * scaleX;
    ctx.strokeStyle = '#FF007F';
    ctx.lineWidth = 3;
    ctx.fillStyle = hasHitTarget ? '#39FF14' : '#FF007F';

    ctx.beginPath();
    ctx.arc(targetPx, height - padding, 8, 0, Math.PI, true);
    ctx.stroke();
    ctx.fill();

    // Launcher origin
    ctx.fillStyle = '#00E5FF';
    ctx.beginPath();
    ctx.arc(padding, height - padding, 5, 0, Math.PI * 2);
    ctx.fill();

    // Vector Angle line
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(
      padding + Math.cos(angleRad) * 20,
      height - padding - Math.sin(angleRad) * 20
    );
    ctx.stroke();

    // Theoretical trajectory path (dashed)
    ctx.strokeStyle = 'rgba(57, 255, 20, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    
    for (let t = 0; t <= timeOfFlight; t += timeOfFlight / 50) {
      const x = velocity * Math.cos(angleRad) * t;
      const y = velocity * Math.sin(angleRad) * t - 0.5 * gravity * Math.pow(t, 2);
      
      const px = padding + x * scaleX;
      const py = height - padding - y * scaleY;
      
      if (px < width - padding && py < height) {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Animated active projectile
    if (isSimulating) {
      const x = velocity * Math.cos(angleRad) * simTime;
      const y = velocity * Math.sin(angleRad) * simTime - 0.5 * gravity * Math.pow(simTime, 2);

      const px = padding + x * scaleX;
      const py = height - padding - y * scaleY;

      ctx.strokeStyle = '#39FF14';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(padding, height - padding);
      for (let t = 0; t <= simTime; t += 0.05) {
        const tx = velocity * Math.cos(angleRad) * t;
        const ty = velocity * Math.sin(angleRad) * t - 0.5 * gravity * Math.pow(t, 2);
        ctx.lineTo(padding + tx * scaleX, height - padding - ty * scaleY);
      }
      ctx.stroke();

      ctx.fillStyle = '#39FF14';
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [angle, velocity, gravity, targetDistance, isSimulating, simTime, hasHitTarget]);

  useEffect(() => {
    let animId;
    if (isSimulating) {
      const start = performance.now();
      const run = (now) => {
        const elapsed = (now - start) / 1000;
        const adjustedTime = elapsed * 1.5;

        if (adjustedTime >= timeOfFlight) {
          setSimTime(timeOfFlight);
          setIsSimulating(false);
          checkHit();
        } else {
          setSimTime(adjustedTime);
          animId = requestAnimationFrame(run);
        }
      };
      animId = requestAnimationFrame(run);
    }
    return () => cancelAnimationFrame(animId);
  }, [isSimulating]);

  const startSimulation = () => {
    if (playClickSound) playClickSound();
    setSimTime(0);
    setHasHitTarget(false);
    setIsSimulating(true);
  };

  const checkHit = () => {
    const diff = Math.abs(range - targetDistance);
    if (diff <= 3.5) {
      setHasHitTarget(true);
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.8 },
        colors: ['#FF5500', '#39FF14', '#00E5FF', '#FF007F']
      });
    } else {
      setHasHitTarget(false);
    }
  };

  const resetChallenge = () => {
    if (playClickSound) playClickSound();
    const newTarget = Math.floor(Math.random() * 80) + 40;
    setTargetDistance(newTarget);
    setHasHitTarget(false);
    setSimTime(0);
    setIsSimulating(false);
  };

  return (
    <div className="col-span-1 brutal-card p-6 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none font-mono text-8xl font-black text-[#00E5FF]">
        04
      </div>

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="bg-[#00E5FF] text-black font-black text-xs px-2.5 py-0.5 border border-white flex items-center gap-1 uppercase tracking-wider">
            <Target className="w-3.5 h-3.5" /> JEE PHYSICS SIMULATOR
          </span>
          <span className="text-[10px] text-neutral-400 font-mono">2D PROJECTILE SANDBOX</span>
        </div>

        <h3 className="text-xl font-black text-white mb-1 tracking-tight">
          Launch Target Challenge
        </h3>
        <p className="text-xs text-neutral-400 font-mono mb-4">
          Dial in values of angle, velocity, and gravity to hit the target!
        </p>

        {/* Dynamic Canvas Area */}
        <div className="relative border-2 border-white bg-[#000000] p-2 flex justify-center shadow-[4px_4px_0px_0px_#39FF14] mb-5">
          <canvas
            ref={canvasRef}
            width={340}
            height={160}
            className="w-full max-h-[160px]"
          />
          
          {/* Hit / Success Overlay */}
          <AnimatePresence>
            {hasHitTarget && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#39FF14] text-black flex flex-col items-center justify-center p-4 border-2 border-white z-20 text-center"
              >
                <Award className="w-10 h-10 animate-bounce mb-1" />
                <h4 className="text-lg font-black tracking-tight uppercase">Target Destroyed!</h4>
                <p className="text-[10px] font-bold font-mono">
                  Range: {range.toFixed(2)}m (Goal: {targetDistance}m)
                </p>
                <button
                  onClick={resetChallenge}
                  className="mt-2.5 px-3 py-1 bg-[#000000] text-white font-bold text-[10px] font-mono border-2 border-white shadow-[2px_2px_0px_0px_#ffffff]"
                >
                  NEXT TARGET
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Physics Formulas Outputs */}
        <div className="grid grid-cols-3 gap-2 mb-5 font-mono text-[10px] bg-[#0d0d0d] border-2 border-white p-2.5 shadow-[2px_2px_0px_0px_#ffffff]">
          <div className="text-center border-r border-neutral-800">
            <div className="text-neutral-400 font-bold">RANGE (R)</div>
            <div className="text-[#39FF14] font-black text-xs mt-0.5">{range.toFixed(2)}m</div>
            <div className="text-[8px] text-neutral-500 mt-0.5">u²sin2θ / g</div>
          </div>
          <div className="text-center border-r border-neutral-800">
            <div className="text-neutral-400 font-bold">MAX HEIGHT (H)</div>
            <div className="text-[#00E5FF] font-black text-xs mt-0.5">{maxHeight.toFixed(2)}m</div>
            <div className="text-[8px] text-neutral-500 mt-0.5">u²sin²θ / 2g</div>
          </div>
          <div className="text-center">
            <div className="text-neutral-400 font-bold">TIME (T)</div>
            <div className="text-[#FF5500] font-black text-xs mt-0.5">{timeOfFlight.toFixed(2)}s</div>
            <div className="text-[8px] text-neutral-500 mt-0.5">2usinθ / g</div>
          </div>
        </div>

        {/* Parameter Sliders */}
        <div className="space-y-3 mb-6">
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-neutral-300">Launch Angle (&theta;):</span>
              <span className="text-[#00E5FF] font-bold">{angle}&deg;</span>
            </div>
            <input
              type="range"
              min="10"
              max="85"
              step="1"
              value={angle}
              onChange={(e) => {
                setAngle(Number(e.target.value));
                setHasHitTarget(false);
              }}
              className="w-full accent-[#00E5FF] bg-black border border-white h-2 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-neutral-300">Initial Velocity (u):</span>
              <span className="text-[#00E5FF] font-bold">{velocity} m/s</span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="1"
              value={velocity}
              onChange={(e) => {
                setVelocity(Number(e.target.value));
                setHasHitTarget(false);
              }}
              className="w-full accent-[#00E5FF] bg-black border border-white h-2 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-neutral-300">Gravity acceleration (g):</span>
              <span className="text-[#00E5FF] font-bold">{gravity} m/s²</span>
            </div>
            <input
              type="range"
              min="5"
              max="20"
              step="0.1"
              value={gravity}
              onChange={(e) => {
                setGravity(Number(e.target.value));
                setHasHitTarget(false);
              }}
              className="w-full accent-[#00E5FF] bg-black border border-white h-2 cursor-pointer"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2">
          <button
            onClick={startSimulation}
            disabled={isSimulating}
            className="flex-1 brutal-btn px-4 py-2 text-xs flex items-center justify-center gap-1.5 font-black"
          >
            <Zap className="w-3.5 h-3.5 fill-black" />
            {isSimulating ? 'SIMULATING...' : 'LAUNCH BALL'}
          </button>
          
          <button
            onClick={resetChallenge}
            className="px-3 py-2 bg-[#000000] border-2 border-white text-white hover:bg-[#181818] font-bold text-xs flex items-center justify-center gap-1 shadow-[2px_2px_0px_0px_#ffffff]"
            title="Wipe and Randomize Target"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-800 text-[10px] text-neutral-500 font-mono flex items-center justify-between">
        <span>Target: {targetDistance}m (Tolerance &plusmn;3.5m)</span>
        <span className="text-[#00E5FF]">JEE PHYSICS CHALLENGE</span>
      </div>
    </div>
  );
}
