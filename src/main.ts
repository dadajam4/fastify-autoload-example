import Fastify from 'fastify';

// load-controllers-plugin で全てのコントローラーのimportと、
// ファイル名からケバブケースに処理したプレフィクス生成が処理されている
import Controllers from 'virtual:controllers';

async function main() {
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

  try {
    await app.listen({ host: '0.0.0.0', port: 3000 });
    console.log(`Launched! http://localhost:3000`);
    return app;
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

// tsupのウォッチャでサーバをクローズできるようにいちおうfastifyのインスタンスを返却しておく
// しかしたぶんcloseしないでも大丈夫そう
export default main();
