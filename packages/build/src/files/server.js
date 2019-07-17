require("source-map-support").install({ hookRequire: true });

const http = require("http");
const { assets, routes } = require("./middleware");
const PORT = process.env.PORT || global.PORT;
const assetsMatch = /^\/assets\//;

const server = http.createServer((req, res) => {
  if (assetsMatch.test(req.url)) {
    req.url = req.url.slice(7);
    assets(req, res, () => {
      res.end("Not Found");
    });
  } else {
    routes(req, res, () => {
      res.end("Not Found");
    });
  }
});

server.listen(PORT);
