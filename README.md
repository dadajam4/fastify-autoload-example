# fastify-autoload-example
ESBuildをバンドラとして利用するFastifyなアプリケーションでコントローラー的なものをautoloadするサンプル。このリポジトリではバンドラとして `tsup` を利用しています。

## 遊び方

1. リポジトリクローン `git clone git@github.com:dadajam4/fastify-autoload-example.git`
2. 依存関係インストール `yarn`
3. tsupをウォッチモードで起動 `yarn dev`
4. このへんで応答があることを確認する http://localhost:3000/hello-world

## 仕組み

指定のディレクトリ内に存在するファイルを全て型情報付きでimportするESBuildのプラグインを実装する。

[ソースコード](./esbuild-plugins/load-controllers/plugin.ts)

このプラグインで、`virtual:controllers` という名前の拡張モジュールのimportをキャッチした際にカスタムのTSコードをESBuildに伝える。
ロード対象のファイル名はアンダースコアで始まらない、 `xxxController.ts` を対象にして、APIのプレフィクスもこのコントローラー名から自動生成する。

拡張モジュール（`virtual:controllers`）型情報の存在をTSコンパイラに教えてあげる。

[拡張モジュール定義](./esbuild-plugins/load-controllers/shims.d.ts)

```ts
    "types": ["node", "./esbuild-plugins/load-controllers/shims"],
```

アプリケーションでfastifyをセットアップする箇所で、この拡張モジュールをimportしてfastifyをセットアップする。

[ソースコード](./src/main.ts)

```ts
import Controllers from 'virtual:controllers';

// 中略...

  const app = Fastify();

  for (const { prefix, Controller } of Controllers) {
    const controller = new Controller();
    app.register((instance, opts, done) => {
      controller.register(instance);
      done();
    }, {
      // ファイル名が HelloWorldController の場合 `"hello-world"` となっている
      prefix,
    });
  }

```

## あとがき

このサンプルはこんなこともできるよ、だけど、少なからずブラックボックスになりうるので、tsoaとかNestとかの一般的なジェネレータでやった方が良いかも。
