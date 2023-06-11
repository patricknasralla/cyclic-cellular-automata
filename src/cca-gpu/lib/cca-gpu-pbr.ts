import { RefObject } from 'react';
import { Vector2, WebGLRenderer } from 'three';

import { PBR_DEFAULTS } from '../../lib/presentation-defaults';
import { ComputeBuffers, NEIGHBOURHOOD, ShaderPass, Size } from '../../model/model';
import { makeComputeBuffers } from './compute-buffers';
import { makeComputePass } from './compute-pass';
import { makePBRDrawPass } from './draw-and-post-process';
import { makeInitPass } from './init-pass';


export function makeCCAGPUPBR() {
  let renderer:       WebGLRenderer;
  let computeBuffers: ComputeBuffers;
  let initializePass: ShaderPass;
  let computePass:    ShaderPass;
  let drawPass:       ShaderPass;

  return { dispose, init, reset, step, setThreshold, setNeighbourhood, setNSize, setStates, setWindowSize };


  // general setup.
  function init(canvasRef: RefObject<HTMLCanvasElement>) {
    const canvas = canvasRef.current;

    if (!canvas) {
      throw new Error('Canvas ref is not set');
    }

    renderer = new WebGLRenderer({
      powerPreference:       'high-performance',
      canvas,
      preserveDrawingBuffer: true,
      alpha:                 true,
    });

    computeBuffers = makeComputeBuffers(renderer.getSize(new Vector2()));

    initializePass = makeInitPass({ computeBuffers, renderer, defaults: PBR_DEFAULTS });
    computePass = makeComputePass({ computeBuffers, renderer, defaults: PBR_DEFAULTS });
    drawPass = makePBRDrawPass({ computeBuffers, renderer, defaults: PBR_DEFAULTS });

    reset();
  }

  function reset() {
    // initialize the CCA and render the initial state to the screen
    initializePass.render();
    drawPass.render();
    computeBuffers.swap(); // this required to get the computeBuffers ready for the first step()
  }


  function step() {
    // run the compute pass using the ComputeBuffers
    computePass.render();

    // render the newly written CCA texture to the screen
    drawPass.render();

    // swap the read and write ComputeBuffers
    computeBuffers.swap();
  }

  function dispose() {
    computeBuffers.dispose();
    initializePass.dispose();
    computePass.dispose();
    drawPass.dispose();
  }

  // external state update functions
  function setThreshold(threshold: number): void {
    if (threshold < 1) {
      throw new Error('Threshold must be greater than 0');
    }
    computePass.material.uniforms.threshold.value = threshold;
  }

  function setStates(states: number): void {
    if (states < 2) {
      throw new Error('States must be greater than 1');
    }
    computePass.material.uniforms.states.value = states;
    initializePass.material.uniforms.states.value = states;
    drawPass.material.uniforms.states.value = states;
  }

  function setNeighbourhood(neighbourhood: NEIGHBOURHOOD): void {
    computePass.material.uniforms.neighbourhood.value = neighbourhood === NEIGHBOURHOOD.MOORE;
  }

  function setNSize(nSize: number): void {
    if (nSize < 1) {
      throw new Error('NSize must be greater than 0');
    }
    computePass.material.uniforms.nSize.value = nSize;
  }

  function setWindowSize(size: Size): void {
    const { width, height } = size;
    renderer.setSize(width, height);
    computeBuffers.setSize(width, height);
  }

}
