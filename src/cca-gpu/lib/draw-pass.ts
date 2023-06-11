/* eslint-disable array-element-newline */
import { DataTexture, LinearFilter, Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial } from 'three';

import { ShaderPass, ShaderPassProps } from '../../model/model';
import fragmentShader from './cca-draw.frag?raw';
import vertexShader from './planar-uv.vert?raw';

// This is the gradient that is used to color the CCA and is passed to the shader as the `colorMap` texture.
const gradient = [
  252, 253, 198, 255,
  248, 223, 168, 255,
  244, 194, 141, 255,
  241, 163, 118, 255,
  234, 134, 102, 255,
  224, 105, 98, 255,
  205, 84, 106, 255,
  181, 70, 116, 255,
  129, 49, 125, 255,
  105, 37, 125, 255,
  80, 26, 121, 255,
  54, 18, 108, 255,
  30, 18, 72, 255,
];

/**
 * The Draw Pass is responsible for drawing the CCA texture to the screen and is called on every `step`.
 * It is also called on `reset` and when the CCA is first created in order for us to see the initial state.
 */
export function makeDrawPass(props: ShaderPassProps): ShaderPass {
  const { renderer, computeBuffers, defaults } = props;

  const uniforms = {
    ccaState: { value: computeBuffers.getReadTexture() },
    colorMap: { value: makeGradientTexture(gradient) },
    states:   { value: defaults.states },
  };

  const material = new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  });

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  scene.add(new Mesh(new PlaneGeometry(2, 2), material));

  return { dispose, material, render };

  function render(): void {
    uniforms.ccaState.value = computeBuffers.getCCATexture();
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  }

  function dispose(): void {
    material.dispose();
  }

  function makeGradientTexture(gradient: number[]): DataTexture {
    const width = gradient.length / 4;
    const height = 1;
    const data = new Uint8Array(gradient);

    const texture = new DataTexture(data, width, height);
    texture.magFilter = LinearFilter;
    texture.minFilter = LinearFilter;

    texture.needsUpdate = true;

    return texture;
  }
}
