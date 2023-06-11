import { wrapValue } from '../../lib/math';
import { ReactCCAGrid } from '../../model/model';

interface Props {
  width:  number
  height: number
}

/**
 * A simple grid to store CCA cell data.
 * Each cell itself can be expressed as a single integer value which describes the cell's current state.
 */
export function makeCCAGrid(props: Props): ReactCCAGrid {
  const { width, height } = props;
  const grid = new Array(width * height).fill(0);

  return { getCell, flatMap, reset, setCell };


  /**
   * Get the value of a cell at the given coordinates.
   * note that the grid will wrap for out of bounds coordinates.
   */
  function getCell(x: number, y: number): number {
    const xWrapped = wrapValue(x, width);
    const yWrapped = wrapValue(y, height);
    return grid[yWrapped * width + xWrapped];
  }

  function setCell(x: number, y: number, value: number): void {
    if (x < 0 || x >= width || y < 0 || y >= height) {
      throw new Error(`Cell coordinates out of grid bounds: (${x}, ${y})`);
    }
    grid[y * width + x] = value;
  }

  function reset(): void {
    grid.fill(0);
  }

  function flatMap(fn: (value: number, index: number, array: number[]) => number[]): number[] {
    return grid.flatMap(fn);
  }
}
