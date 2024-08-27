import { join } from 'path';
import uni from '@dcloudio/vite-plugin-uni';
import postcssUrl from 'postcss-url';

const uniBase = ({
  base,
}) => {
  let resolver;
  return [
    {
      name: 'uni-force-base',
      enforce: 'pre',
      config() {
        return {
          css: {
            postcss: {
              plugins: [
                postcssUrl({
                  async url({ url }, { file }) {
                    if (!url.startsWith('@/') && !url.startsWith('.')) return url;

                    let resolved = true;
                    try {
                      const resolvedPath = await resolver(url, join(file, 'index'));
                      resolved = !!resolvedPath;
                    } catch {
                      resolved = false;
                    }
                    if (!resolved) {
                      throw new Error(`Could not resolve "${url}"`);
                    }

                    const relPath = url.replace(/^(@|[\./]+)(static)?\//, '');
                    return `${base}${relPath}`;
                  },
                }),
              ],
            },
          },
        };
      },
      configResolved(config) {
        resolver = config.createResolver();
      },
      generateBundle(_opts, bundle) {
        const assetsJs = bundle['common/assets.js'];
        if (!assetsJs || !('code' in assetsJs)) return;
        assetsJs.code = assetsJs.code.replace(/(?<=_imports_\d+=").+?(?=")/g, (str) => (
          str.replace(/^\/(static\/)?/, base)
        ));
      },
    },
  ];
};

// https://vitejs.dev/config/
export default {
  plugins: [
    uniBase({
      base: 'https://example.com/example/path/',
    }),
    uni(),
  ],
};
