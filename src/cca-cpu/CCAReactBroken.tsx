import { ReactElement, useEffect, useMemo, useState } from 'react';

import { NEIGHBOURHOOD, ReactCCA } from '../model/model';
import { mainContainer } from '../shared.css';
import { UIPanel } from '../shared/UI';
import { makeCCAReactBroken } from './lib/cca-react-broken';
import { gridCell, gridContainer, gridRow } from './styles/CCAReact.css';

const DEFAULTS = {
  width:         100,
  height:        100,
  threshold:     4,
  states:        5,
  neighbourhood: NEIGHBOURHOOD.MOORE,
  nSize:         2,
};

const COLORS = [
  '#035959',
  '#1BA6A6',
  '#F2E4C9',
  '#F2A35E',
  '#D97971',
  '#F25757',
];

const FPS = 24;

/**
 * This is an incorrectly working version of CCA. It is included to show what happens when you don't use two grids.
 * as such, it is best ignored.
 */
export function CCAReactBroken(): ReactElement {
  const CCAReact = useMemo<ReactCCA>(() => makeCCAReactBroken(DEFAULTS).init(), []);
  const [currentState, setCurrentState] = useState(CCAReact.getGridRows());
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        CCAReact.step();
        setCurrentState(CCAReact.getGridRows());
      }, 1000 / FPS);
    }

    return () => {
      clearInterval(interval);
    };
  }, [CCAReact, isRunning]);

  return (
    <div className={mainContainer}>
      <UIPanel
        defaults={{
          states:        DEFAULTS.states,
          threshold:     DEFAULTS.threshold,
          nSize:         DEFAULTS.nSize,
          neighbourhood: true,
        }}
        onStep={handleStep}
        onReset={handleReset}
        onStart={handleStart}
        isRunning={isRunning}
        onUpdateThreshold={handleUpdateThreshold}
        onUpdateStates={handleUpdateStates}
        onUpdateNSize={handleUpdateNSize}
        onUpdateNType={handleUpdateNType}
      />
      <CCAGrid
        gridRows={currentState}
        width={DEFAULTS.width}
        height={DEFAULTS.height}
      />
    </div>
  );


  // handles
  function handleStep(): void {
    CCAReact.step();
    setCurrentState(CCAReact.getGridRows());
  }

  function handleReset(): void {
    CCAReact.init();
    setCurrentState(CCAReact.getGridRows());
  }

  function handleStart(): void {
    setIsRunning((prev) => !prev);
  }

  function handleUpdateThreshold(threshold: number): void {
    CCAReact.setThreshold(threshold);
  }

  function handleUpdateStates(states: number): void {
    CCAReact.setStates(states);
  }

  function handleUpdateNSize(size: number): void {
    CCAReact.setNSize(size);
  }

  function handleUpdateNType(type: NEIGHBOURHOOD): void {
    CCAReact.setNeighbourhood(type);
  }
}


interface Props {
  gridRows: number[][]
  height:   number
  width:    number
}


function CCAGrid(props: Props): ReactElement {
  const { gridRows, width, height } = props;

  return (
    <div className={gridContainer} style={{
      width:  width * 10,
      height: height * 10 + 59,
    }}>
      <p>This is a broken version of the CCA with only one buffer/grid!</p>
      {gridRows.map((row, idx) => (
        <div key={idx} className={gridRow}>
          {row.map((cellState, idx) => (
            <CCACell key={idx} state={cellState} />
          ))}
        </div>
      ))}
    </div>
  );
}

function CCACell(props: { state: number }): ReactElement {
  const { state } = props;

  return (
    <div
      className={gridCell}
      style={{
        backgroundColor: COLORS[state],
      }}
    />
  );
}
