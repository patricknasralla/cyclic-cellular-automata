// expand this into other files if it gets too big...

import { RefObject } from 'react';
import { ShaderMaterial, Texture, Vector2, WebGLRenderer, WebGLRenderTarget } from 'three';

import { GPUDefaults } from '../lib/presentation-defaults';

export enum NEIGHBOURHOOD {
  MOORE       = 'MOORE',
  VON_NEUMANN = 'VON_NEUMANN',
}

/**
 * Basic CCA interface for all implematations.
 */
export interface CCA {
  init:             () => CCA
  setNeighbourhood: (neighbourhood: NEIGHBOURHOOD) => void
  setNSize:         (nSize: number) => void
  setStates:        (states: number) => void
  setThreshold:     (threshold: number) => void
  step:             VoidFunction
}

/**
 * React/CPU speciric methods
 */
export interface ReactCCA extends CCA {
  getGridRows:  () => number[][]
  init:         () => ReactCCA
}

/**
 * 2D canvas specific methods
 */
export interface CanvasCCA extends CCA {
  init:          () => CanvasCCA
  renderToImage: () => ImageData
}

/**
 * The Grid interface is used to store the CCA state.
 */
export interface ReactCCAGrid {
  flatMap: (fn: (value: number, index: number, array: number[]) => number[]) => number[]
  getCell: (x: number, y: number) => number
  reset:   VoidFunction
  setCell: (x: number, y: number, value: number) => void
}


// Props for all cpu cca factory functions
export interface MakeCCAProps {
  height:        number
  neighbourhood: NEIGHBOURHOOD
  nSize:         number
  states:        number
  threshold:     number
  width:         number
}

// GPU CCA factory function props
export interface MakeCCAGPUProps extends Omit<MakeCCAProps, 'width' | 'height'> {
  canvasRef: RefObject<HTMLCanvasElement>
}

// Compute Buffer definition
export interface ComputeBuffers {
  dispose:        VoidFunction
  getCCATexture:  Getter<Texture>
  getReadTexture: Getter<Texture>
  getSize:        Getter<Vector2>
  getWriteBuffer: Getter<WebGLRenderTarget>
  setSize:        (width: number, height: number) => void
  swap:           VoidFunction
}

// Shader Pass definition
export interface ShaderPass {
  dispose:  VoidFunction
  material: ShaderMaterial
  render:   VoidFunction
}

export interface ShaderPassProps {
  computeBuffers: ComputeBuffers
  renderer:       WebGLRenderer
  defaults:       GPUDefaults
}


// Utility interfaces
export interface Getter<Value> {
  (): Value
}

export interface Size {
  width:  number
  height: number
}
