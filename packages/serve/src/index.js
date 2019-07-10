const DevServer = require("webpack-dev-server");
const SpawnServerPlugin = require("spawn-server-webpack-plugin");
const FriendlyErrorPlugin = require("friendly-errors-webpack-plugin");
const build = require("@marko/build");

module.exports = ({ dir, file, port = 3000, verbose, nodeArgs }) => {
  const additionalClientEntries = [
    `webpack-dev-server/client?http://localhost:${port}/`
  ];
  const spawnedServer = new SpawnServerPlugin({ args: nodeArgs });
  const clientPlugins = [];
  const serverPlugins = [spawnedServer];

  const compiler = build({
    dir,
    file,
    production: false,
    additionalClientEntries,
    clientPlugins,
    serverPlugins
  });

  if (!verbose) {
    const friendlyErrors = new FriendlyErrorPlugin();
    friendlyErrors.apply(compiler);
  }

  const server = new DevServer(compiler, {
    quiet: !verbose,
    inline: false,
    overlay: true,
    stats: verbose ? "verbose" : "errors-only",
    clientLogLevel: verbose ? "info" : "error",
    watchOptions: { ignored: [/node_modules/] },
    proxy: [
      {
        logLevel: "error",
        context: url => !/^\/(__open-stack-frame-in-editor)/.test(url),
        target: true,
        router: () => `http://localhost:${spawnedServer.address.port}`
      }
    ],
    before(app) {
      app.use((req, res, next) => {
        if (spawnedServer.listening) next();
        else spawnedServer.once("listening", next);
      });
    }
  });

  server.listen(port);

  return new Promise(resolve =>
    spawnedServer.once("listening", () => resolve(server))
  );
};
