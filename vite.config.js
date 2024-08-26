import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

const base = 'https://example.com/example/path';

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [
    uni(),
    {
      name: 'override-base-dir',
      config() {
        return {
          base,
        };
      },
    },
  ],
})
