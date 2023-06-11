import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { ImageLoader } from 'esbuild-vanilla-image-loader';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

// https://vitejs.dev/config/
export default defineConfig(() => {
  const config = {
    plugins: [
      react(),
      vanillaExtractPlugin({
        esbuildOptions: {
          plugins: [ImageLoader()],
        },
      }),
      glsl(),
    ],
    assetsInclude: ['**/*.png'],
    test:          {
      globals: true,
    },
  };

  return config;
});
