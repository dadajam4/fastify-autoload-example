import { defineConfig } from 'tsup';
import { LoadControllersPlugin } from './esbuild-plugins';
import path from 'node:path';

export default defineConfig((options) => {
  return {
    entry: {
      'main': './src/main.ts',
    },
    clean: true,
    esbuildPlugins: [
      // コントローラーエイリアスimport用プラグイン
      // ESBuildを利用しているserverless-esbuildとかViteとかどこでも利用できるはず
      LoadControllersPlugin(path.join(__dirname, 'src/controllers')),
    ],
  }
})
