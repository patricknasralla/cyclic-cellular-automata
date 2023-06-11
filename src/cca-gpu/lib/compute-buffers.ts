import { FloatType, NearestFilter, Texture, Vector2, WebGLRenderTarget } from 'three';

import { ComputeBuffers } from '../../model/model';


const RENDER_TARGET_PROPS = {
  type:            FloatType,
  magFilter:       NearestFilter,
  minFilter:       NearestFilter,
  generateMipmaps: false,
};

/**
 * On the GPU, we need two render targets to ping-pong between. These are the equivalent of the
 * two grids in the CPU version.
 * A render target is a buffer that can be rendered to. It has a texture property that is a reference
 * to the actual texture that is being rendered to. This texture can be used as a uniform in a
 * shader program. This is how we pass the state of the CCA to the shader as shaders can read from
 * texture uniforms.
 * Shaders can only write to buffers though, so we need to be able to send the buffer as well as the
 * texture.
 */
export function makeComputeBuffers(size = new Vector2(100, 100)): ComputeBuffers {
  const target1 = new WebGLRenderTarget(size.width, size.height, { ...RENDER_TARGET_PROPS });
  const target2 = new WebGLRenderTarget(size.width, size.height, { ...RENDER_TARGET_PROPS });
  let isSwapped = false;

  return { dispose, getCCATexture, getReadTexture, getSize, getWriteBuffer, setSize, swap };

  function setSize(width: number, height: number): void {
    target1.setSize(width, height);
    target2.setSize(width, height);
  }

  // assumes that target1 and target2 have the same size (which they should).
  function getSize(): Vector2 {
    return new Vector2(target1.width, target1.height);
  }

  function swap(): void {
    isSwapped = !isSwapped;
  }

  function getReadTexture(): Texture {
    return isSwapped ? target1.texture : target2.texture;
  }

  function getWriteBuffer(): WebGLRenderTarget {
    return isSwapped ? target2 : target1;
  }

  /**
   * Returns the most recently written texture for the rendering to screen pass.
   * We assume here that the swap occurs as the first step in the CCA's step function.
   */
  function getCCATexture(): Texture {
    return isSwapped ? target2.texture : target1.texture;
  }

  /**
   * Because render targets are stored in GPU memory, we need to dispose of them when we're done
   * as they're not garbage collected.
   */
  function dispose(): void {
    target1.dispose();
    target2.dispose();
  }
}
