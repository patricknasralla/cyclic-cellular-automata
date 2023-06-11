import { ReactElement, useEffect, useMemo, useRef, useState } from 'react';

import { canvasStyles } from '../cca-cpu/styles/CCACanvas.css';
import { useWindowSize } from '../hooks/use-window-size';
import { PBR_DEFAULTS } from '../lib/presentation-defaults';
import { NEIGHBOURHOOD } from '../model/model';
import { UIPanel } from '../shared/UI';
import { makeCCAGPUPBR } from './lib/cca-gpu-pbr';


export function CCAGpuPbr(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const windowSize = useWindowSize();
  const [isRunning, setIsRunning] = useState(false);
  const cca = useMemo(() => makeCCAGPUPBR(), []);

  // initialize the cca and handle disposal
  useEffect(() => {
    if (canvasRef.current) {
      cca.init(canvasRef);
      cca.setWindowSize(windowSize);
    }

    return () => {
      cca.dispose();
    };
  }, [cca, canvasRef, windowSize]);


  // the animation/game loop
  useEffect(() => {
    let clear = requestAnimationFrame(() => {
      tick();
    });

    function tick(): void {
      if (isRunning) {
        cca.step();
      }
      clear = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(clear);
    };
  }, [cca, isRunning]);


  return (
    <>
      <UIPanel
        defaults={PBR_DEFAULTS}
        onStep={doStep}
        onReset={handleReset}
        onStart={handleStart}
        isRunning={isRunning}
        onUpdateThreshold={handleUpdateThreshold}
        onUpdateStates={handleUpdateStates}
        onUpdateNSize={handleUpdateNSize}
        onUpdateNType={handleUpdateNType}
      />
      <canvas className={canvasStyles} ref={canvasRef} width={windowSize.width} height={windowSize.height} />
    </>
  );


  // event handlers
  function handleReset(): void {
    cca.reset();
  }

  function handleStart(): void {
    setIsRunning((prev) => !prev);
  }

  function handleUpdateThreshold(threshold: number): void {
    cca.setThreshold(threshold);
  }

  function handleUpdateStates(states: number): void {
    cca.setStates(states);
  }

  function handleUpdateNSize(size: number): void {
    cca.setNSize(size);
  }

  function handleUpdateNType(type: NEIGHBOURHOOD): void {
    cca.setNeighbourhood(type);
  }

  function doStep(): void {
    cca.step();
  }
}
