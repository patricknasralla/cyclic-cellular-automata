import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'

// https://vitejs.dev/config/
export default defineConfig(() => {
  const config = {
    plugins: [
      react(),
      vanillaExtractPlugin(),
      glsl(),
    ],

    test: {
      globals: true,
    },
  }

  return config
})

