
interface Props {
  width:  number
  height: number
}

/**
 * A simple grid to store CCA cell data.
 * Each cell itself can be expressed as a single integer value which describes the cell's current state.
 */
export function makeCCAGrid(props: Props) {
  const { width, height } = props;
  const grid = new Array(width * height).fill(0);

  return { getCell, setCell, reset };


  function getCell(x: number, y: number) {
    return grid[y * width + x];
  }

  function setCell(x: number, y: number, value: number) {
    grid[y * width + x] = value;
  }

  function reset() {
    grid.fill(0);
  }
}
