/* eslint-disable array-element-newline */
import { Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, Vector3 } from 'three';

import { ShaderPass, ShaderPassProps } from '../../model/model';
import fragmentShader from './cca-draw-shaded.frag?raw';
import vertexShader from './planar-uv.vert?raw';


/**
 * A more complicated Render that uses PBR techniques to give the illusion of light and depth.
 * The only difference here is that the fragment shader is much more complicated and requires more
 * uniforms to be sent across.
 */
export function makePBRDrawPass(props: ShaderPassProps): ShaderPass {
  const { renderer, computeBuffers, defaults } = props;

  const uniforms = {
    ccaState:   { value: computeBuffers.getReadTexture() },
    states:     { value: defaults.states },
    resolution: { value: computeBuffers.getSize() },

    diffuseColor:   { value: new Vector3(0.9, 0.6, 0.5) },
    ambientColor:   { value: new Vector3(0.5, 0.4, 0.4) },
    lightColor:     { value: new Vector3(0.8, 0.7, 0.3) },
    lightDirection: { value: new Vector3(0.55, 0.5, 0.6) },
    lightIntensity: { value: 0.4 },
    focalDistance:  { value: 2.0 },
    metalness:      { value: 0.7 },
    roughness:      { value: 0.3 },
  };

  const material = new ShaderMaterial({
    uniforms: uniforms,
    vertexShader,
    fragmentShader,
  });
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const scene = new Scene();
  scene.add(new Mesh(new PlaneGeometry(2, 2), material));


  return { dispose, material, render };


  function render(): void {
    uniforms.ccaState.value = computeBuffers.getCCATexture();   // this is the buffer that holds the computed CCA state.
    uniforms.resolution.value = computeBuffers.getSize();

    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  }


  function dispose(): void {
    material?.dispose();
  }
}
