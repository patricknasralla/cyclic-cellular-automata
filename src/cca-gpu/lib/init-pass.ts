import { Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial } from 'three';

import { ShaderPass, ShaderPassProps } from '../../model/model';
import fragmentShader from './cca-init.frag?raw';
import vertexShader from './planar-uv.vert?raw';


/**
 * The Init Pass is responsible for initializing the CCA texture with random values.
 * It is called on `reset` and when the CCA is first created. But is not called on `step`.
 */
export function makeInitPass(props: ShaderPassProps): ShaderPass {
  const { renderer, computeBuffers, defaults } = props;

  const uniforms = {
    states: { value: defaults.states },
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
    renderer.setRenderTarget(computeBuffers.getWriteBuffer());
    renderer.render(scene, camera);
  }

  function dispose(): void {
    material.dispose();
  }
}
