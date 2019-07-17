require("source-map-support").install({ hookRequire: true });

const getRoute = global.GET_ROUTE;
const modernBrowsers = global.MODERN_BROWSERS_REGEXP;

exports.assets =
  process.env.NODE_ENV === "production" &&
  require("connect-gzip-static")(global.ASSETS_PATH);

exports.routes =
  global.MARKO_MIDDLEWARE ||
  ((req, res) => {
    res.setHeader("content-type", "text/html");
    req.isModern = modernBrowsers.test(req.headers["user-agent"] || "");
    const [pathname, query] = req.url.split("?");
    const route = getRoute(pathname);
    if (route) {
      if (route.redirect) {
        res.statusCode = 301;
        res.setHeader("location", route.path);
        res.end(
          `Redirecting to <a href=${JSON.stringify(route.path)}>${
            route.path
          }</a>`
        );
      } else {
        route.template.render(
          {
            $global: { isModern: req.isModern },
            params: route.params,
            query,
            pathname
          },
          res
        );
      }
    } else {
      res.statusCode = 404;
      res.end("Not Found");
    }
  });
