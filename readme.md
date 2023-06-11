# Cyclic Cellular Automata

This repo is a demonstration of how to implement cyclic cellular automata in the browser using three, increasingly performant but possibly more complicated methods.

1. In HTML using pure React, JS and CSS.
2. Similar to (1) but using a Canvas2D context rather than plain HTML.
3. Using three js and WebGL 2.0 to render the automata on the GPU.

## Using the example app.

To install dependencies simply run `yarn`

To run in dev mode run `yarn dev` which runs locally at `http://localhost:5173/`

Move between versions of the CCA with the left and right arrow keys. The hamburger menu in the top left corner of the screen has a dropdown which lets you play and pause the simulation, reset and step through frames. You can also alter the variables using the sliders. These are:

- States: the number of states a cell can have, this loops back to zero when increased from the maximum.
- Threshold: the threshold score a cell must get before it increases it's state by one. This is set to be equal to or greater than.
- Neighbourhood: the size of the neighbourhood. 1 will look at all cells 1 space away from the current cell, 2 will look at cells 1 and 2 spaces away from the cell and so on. Note that this increases per cell calclulations significantly and might affect performance in the cpu simulations.
- Neighbourhood Type. Moore neighbourhoods sample all the cells around the original, as with Conway's Game of Life. Von Neumann simply samples the cardinal directions.


## The rules for CCA:

1. Each cell counts the number of cells in its neighbourhood which have a state of 1 + its current state.
2. If that number is equal to or more than the threshold, we increase the cell's value by 1.


Packages used:
Create Vite App for speed of building and easy development.
Antd for sliders and buttons
Three js to save me writing hundreds of lines of raw WebGL
Vanilla Extract CSS for CSS in TS and the ease of use that this gives.




<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons Licence" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/80x15.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.
