import { Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial } from 'three';

import { ShaderPass, ShaderPassProps } from '../../model/model';
import fragmentShader from './cca-compute.frag?raw';
import vertexShader from './planar-uv.vert?raw';

/**
 * The Compute Pass is responsible for the actual CCA computation.
 * It is called on `step`. Like all the render passes. It consists of a Scene, Camera and Mesh.
 * The Mesh is a plane that covers the entire screen and the camera is an OrthographicCamera that
 * points at that plane. The mesh also contains a material. The material is a ShaderMaterial that
 * uses the vertex and fragment shaders below which are responsible for the actual computation.
 */
export function makeComputePass(props: ShaderPassProps): ShaderPass {
  const { renderer, computeBuffers, defaults } = props;

  const uniforms = {
    ccaState:      { value: computeBuffers.getReadTexture() },
    resolution:    { value: computeBuffers.getSize() },
    threshold:     { value: defaults.threshold },
    states:        { value: defaults.states },
    nSize:         { value: defaults.nSize },
    neighbourhood: { value: defaults.neighbourhood },
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

    // This sets the shader's ccaState texture to be the read buffer's texture.
    uniforms.ccaState.value = computeBuffers.getReadTexture();
    uniforms.resolution.value = computeBuffers.getSize();

    // This sets the output of the shader to the write buffer's texture.
    renderer.setRenderTarget(computeBuffers.getWriteBuffer());

    // This actually runs the render pass.
    renderer.render(scene, camera);
  }

  /**
   * Because the material is passed to the GPU, it needs to be disposed of when the CCA is
   * cleared as it is not garbage collected.
   */
  function dispose(): void {
    material.dispose();
  }
}
