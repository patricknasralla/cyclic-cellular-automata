import { ReactElement,
  useEffect, useMemo, useRef, useState } from 'react';

import { CanvasCCA, NEIGHBOURHOOD } from '../model/model';
import { mainContainer } from '../shared.css';
import { UIPanel } from '../shared/UI';
import { makeCCACanvas } from './lib/cca-canvas';
import { canvasStyles } from './styles/CCACanvas.css';

const DEFAULTS = {
  width:         400,
  height:        200,
  threshold:     2,
  states:        26,
  neighbourhood: NEIGHBOURHOOD.MOORE,
  nSize:         2,
};


const FPS = 60;


export function CCACanvas(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const CCA2D = useMemo<CanvasCCA>(() => makeCCACanvas(DEFAULTS).init(), []);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        CCA2D.step();
        const imageData = CCA2D.renderToImage();
        canvasRef.current?.getContext('2d')?.putImageData(imageData, 0, 0);
      }, 1000 / FPS);
    }

    return () => {
      clearInterval(interval);
    };
  }, [CCA2D, isRunning]);


  function doStep(): void {
    CCA2D.step();
    const imageData = CCA2D.renderToImage();
    canvasRef.current?.getContext('2d')?.putImageData(imageData, 0, 0);
  }

  function handleReset(): void {
    CCA2D.init();
    const imageData = CCA2D.renderToImage();
    canvasRef.current?.getContext('2d')?.putImageData(imageData, 0, 0);
  }

  function handleStart(): void {
    setIsRunning((prev) => !prev);
  }

  function handleUpdateThreshold(threshold: number): void {
    CCA2D.setThreshold(threshold);
  }

  function handleUpdateStates(states: number): void {
    CCA2D.setStates(states);
  }

  function handleUpdateNSize(size: number): void {
    CCA2D.setNSize(size);
  }

  function handleUpdateNType(type: NEIGHBOURHOOD): void {
    CCA2D.setNeighbourhood(type);
  }

  return (
    <div className={mainContainer}>
      <UIPanel
        defaults={{
          states:        DEFAULTS.states,
          threshold:     DEFAULTS.threshold,
          nSize:         DEFAULTS.nSize,
          neighbourhood: true,
        }}
        onStep={doStep}
        onReset={handleReset}
        onStart={handleStart}
        isRunning={isRunning}
        onUpdateThreshold={handleUpdateThreshold}
        onUpdateStates={handleUpdateStates}
        onUpdateNSize={handleUpdateNSize}
        onUpdateNType={handleUpdateNType}
      />
      <canvas className={canvasStyles} ref={canvasRef} width={DEFAULTS.width} height={DEFAULTS.height} />
    </div>
  );
}
