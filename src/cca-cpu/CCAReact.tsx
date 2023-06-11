import { ReactElement, useEffect, useMemo, useState } from 'react';

import { NEIGHBOURHOOD, ReactCCA } from '../model/model';
import { mainContainer } from '../shared.css';
import { UIPanel } from '../shared/UI';
import { makeCCAReact } from './lib/cca-react';
import { gridCell, gridContainer, gridRow } from './styles/CCAReact.css';


// a pre-defined set of colors for the different states
const COLORS = [
  '#FAEDDA',
  '#AEE8CA',
  '#6ACFC9',
  '#26B6C6',
  '#3C2F80',
  '#b319fa',
  '#fa1986',
  '#fa3719',
];

// lock the FPS to 30
const FPS = 30;


interface Props {
  height:        number
  neighbourhood: NEIGHBOURHOOD
  nSize:         number
  states:        number
  threshold:     number
  width:         number
}

/**
 * The React and HTML implementation of the CCA. Uses the CCA implementation found in `cca-react.ts`.
 */
export function CCAReact(props: Props): ReactElement {
  const CCAReact = useMemo<ReactCCA>(() => makeCCAReact(props).init(), [props]);
  const [currentState, setCurrentState] = useState(CCAReact.getGridRows());
  const [isRunning, setIsRunning] = useState(false);

  // this is the update loop that automates the step function every frame.
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

  // the component JSX itself.
  return (
    <div className={mainContainer}>
      <UIPanel
        defaults={{ states: props.states, threshold: props.threshold, nSize: props.nSize, neighbourhood: true }}
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
        width={props.width}
        height={props.height}
      />
    </div>
  );


  // handlers have been kept separated for readability.
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


interface GridProps {
  gridRows: number[][]
  height:   number
  width:    number
}

/**
 * The actual Grid of cells rendered to the screen.
 * These are simply divs with a background color. As such, rendering a lot of them can be quite expensive.
 * you can see this by increasing the size of the grid.
 */
function CCAGrid(props: GridProps): ReactElement {
  const { gridRows, width, height } = props;

  return (
    <div className={gridContainer} style={{
      width:  width * 10,
      height: height * 10,
    }}>
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

/**
 * A single cell in the grid. This is just a colored div.
 */
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
