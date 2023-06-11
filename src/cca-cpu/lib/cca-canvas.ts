/* eslint-disable max-depth */
import { CanvasCCA, MakeCCAProps, NEIGHBOURHOOD, ReactCCAGrid } from '../../model/model';
import { makeCCAGrid } from './grid';


// const gradient1 = {
//   0: [35, 38, 37, 255],
//   1: [53, 64, 58, 255],
//   2: [76, 89, 79, 255],
//   3: [164, 166, 156, 255],
//   4: [191, 191, 184, 255],
// };

const GRADIENT = [
  [252, 253, 198, 255],
  [248, 223, 168, 255],
  [244, 194, 141, 255],
  [241, 163, 118, 255],
  [234, 134, 102, 255],
  [224, 105, 98, 255],
  [205, 84, 106, 255],
  [181, 70, 116, 255],
  [129, 49, 125, 255],
  [105, 37, 125, 255],
  [80, 26, 121, 255],
  [54, 18, 108, 255],
  [30, 18, 72, 255],
];


// first pass just initialises a grid and creates a checkerboard pattern to make sure the html is rendering correctly
export function makeCCACanvas(props: MakeCCAProps): CanvasCCA {
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
    renderToImage,
    step,
    setThreshold,
    setStates,
    setNeighbourhood,
    setNSize,
  };

  return self;

  function init(): CanvasCCA {
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
   * Organises Grid state into a format for easy react rendering to the 2D canvas.
   */
  function renderToImage(): ImageData {
    const colorValues = readGrid.flatMap((value) => {
      const color = GRADIENT[value % GRADIENT.length];
      return color;
    });
    const imageData = new Uint8ClampedArray(colorValues);
    return new ImageData(imageData, width, height);
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
