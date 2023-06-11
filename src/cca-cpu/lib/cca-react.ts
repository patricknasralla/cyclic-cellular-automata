/* eslint-disable max-depth */

import { MakeCCAProps, NEIGHBOURHOOD, ReactCCA, ReactCCAGrid } from '../../model/model';
import { makeCCAGrid } from './grid';


// first pass just initialises a grid and creates a checkerboard pattern to make sure the html is rendering correctly
export function makeCCAReact(props: MakeCCAProps): ReactCCA {
  const { width, height } = props;

  // CCA requies two grids, one to read from and one to write to, otherwise you end up with race conditions!
  const gridA = makeCCAGrid(props);
  const gridB = makeCCAGrid(props);

  let threshold = props.threshold;
  let states = props.states;
  let neighbourhood = props.neighbourhood;
  let nSize = props.nSize;

  let readGrid: ReactCCAGrid;
  let writeGrid: ReactCCAGrid;

  const self = {
    init,
    step,
    getGridRows,
    setThreshold,
    setStates,
    setNeighbourhood,
    setNSize,
  };

  return self;

  function init(): ReactCCA {
    gridA.reset();
    gridB.reset();

    // set the read and write grids
    readGrid = gridA;
    writeGrid = gridB;

    // randomise the read grid
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        readGrid.setCell(x, y, Math.floor(Math.random() * states));
      }
    }

    return self;
  }

  /**
   * The main algorithm for CCA. This is where the magic happens.
   */
  function step() {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const value = neighbourhood === NEIGHBOURHOOD.MOORE ? convolveMoore(x, y) : convolveVonNeumann(x, y);
        if (value >= threshold) {
          writeGrid.setCell(x, y, ((readGrid.getCell(x, y)) + 1) % states);
        } else {
          writeGrid.setCell(x, y, readGrid.getCell(x, y));
        }
      }
    }

    // swap the read and write grids to be ready for the next step
    const temp = readGrid;
    readGrid = writeGrid;
    writeGrid = temp;
  }

  /**
   * Organises Grid state into a format for easy react rendering as html elements. This is totally not optimal but
   * it's good for explaining the concept, while keeping things simple.
   */
  function getGridRows(): number[][] {
    const rows = [];
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        row.push(readGrid.getCell(x, y) ?? 0);
      }
      rows.push(row);
    }

    return rows;
  }

  function setThreshold(newThreshold: number): void {
    if (newThreshold < 1) {
      throw new Error('Threshold must be greater than 0');
    }
    threshold = newThreshold;
  }

  function setStates(newStates: number): void {
    if (newStates < 2) {
      throw new Error('States must be greater than 1');
    }
    states = newStates;
  }

  function setNeighbourhood(newNeighbourhood: NEIGHBOURHOOD): void {
    neighbourhood = newNeighbourhood;
  }

  function setNSize(newNSize: number): void {
    if (newNSize < 1) {
      throw new Error('NSize must be greater than 0');
    }
    nSize = newNSize;
  }


  function convolveMoore(x: number, y: number): number {
    const currentValue = readGrid.getCell(x, y);
    let sum = 0;

    // sample neighbourhood
    for (let dx = -nSize; dx <= nSize; dx++) {
      for (let dy = -nSize; dy <= nSize; dy++) {
        if (dx === 0 && dy === 0) {
          continue;
        }
        const sampledValue = readGrid.getCell(x + dx, y + dy);
        if (sampledValue === ((currentValue + 1) % states)) {
          sum++;
        }
      }
    }

    return sum;
  }

  function convolveVonNeumann(x: number, y: number): number {
    const currentValue = readGrid.getCell(x, y);
    let sum = 0;

    // sample horizontal neighbourhood
    for (let dx = -nSize; dx <= nSize; dx++) {
      if (dx === 0) {
        continue;
      }
      const sampledValue = readGrid.getCell(x + dx, y);
      if (sampledValue === ((currentValue + 1) % states)) {
        sum++;
      }
    }

    // sample vertical neighbourhood
    for (let dy = -nSize; dy <= nSize; dy++) {
      if (dy === 0) {
        continue;
      }
      const sampledValue = readGrid.getCell(x, y + dy);
      if (sampledValue === ((currentValue + 1) % states)) {
        sum++;
      }
    }

    return sum;
  }
}
