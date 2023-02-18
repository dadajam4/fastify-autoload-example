import { Plugin } from 'esbuild';
import path from 'node:path';
import fs from 'node:fs';

/**
 * アンダースコアで始まらないコントローラーファイル名にマッチする正規表現
 */
const CONTROLLER_NAME_MATCH_RE = /^((?!_).+)Controller\.ts$/;

/**
 * 文字列をケバブケースに変換する
 */
function toKebabCase(str: string) {
	str = str.replace(/^ *?[A-Z]/, function(allStr) { return allStr.toLowerCase(); });
	str = str.replace(/_/g, '-');
	str = str.replace(/ *?[A-Z]/g, function(allStr, i) { return '-' + allStr.replace(/ /g, '').toLowerCase(); });
	return str;
};

/**
 * 指定のディレクトリに存在する全てのコントーラーリストをエイリアスでimportするためのESBuildプラグインを生成する
 * @param dir - コントローラーディレクトリ
 * @returns ESBuildプラグイン
 */
export function LoadControllersPlugin(
  dir: string,
): Plugin {
  return {
    name: 'load-controllers',
    async setup(build) {
      const files = await fs.promises.readdir(dir);
      const imports: string[] = [];
      const pushes: string[] = [];
      const pathMap: Record<string, string> = {};

      for (const file of files) {
        const matched = file.match(CONTROLLER_NAME_MATCH_RE);
        if (!matched) continue;
        const fullPath = path.join(dir, file);
        const name = matched[1];
        const prefix = toKebabCase(name);
        const controllerName = `${name}Controller`;
        imports.push(`import ${controllerName} from 'virtual:controllers:${controllerName}';`);
        pushes.push(`Controllers.push({ prefix: '${prefix}', Controller: ${controllerName} })`);
        pathMap[controllerName] = fullPath;
      }

      const LOAD_TEMPLATE = `${imports.join('\n')}\n\nconst Controllers = [];\n\n${pushes.join('\n')}\n\nexport default Controllers;`;

      // 単一のコントローラーのimportパスを実際のファイルパスに解決する
      build.onResolve({ filter: /^virtual:controllers:.+$/ }, (args) => {
        const controllerName = args.path.replace('virtual:controllers:', '');
        return {
          path: pathMap[controllerName],
        }
      });

      build.onResolve({ filter: /^virtual:controllers$/ }, (args) => {
        return {
          path: args.path,
          namespace: 'load-controllers',
        }
      });

      build.onLoad({ filter: /^virtual:controllers$/, namespace: 'load-controllers' }, (args) => {
        return {
          contents: LOAD_TEMPLATE,
          loader: 'ts',
        }
      });
    },
  }
}
