const apiRoutes = [
  {
    method: 'GET',
    path: '/',
    handler: redirect
  },
  {
    method: 'POST',
    path: '/login',
    handler: redirect
  }
];

const webRoutes = [
  {
    method: 'GET',
    path: '/',
    handler: redirect
  }
];

function redirect(request, h) {
  const actionPath = request.route.path.slice(-1) === '/' ?
    `${request.route.path}index.js` :
    `${request.route.path}.js`
  ;
  return require(`./controller/${request.route.settings.isInternal ? 'api' : 'web'}${actionPath}`)(request.payload, h);
}

function loadApiRoutes() {
  for (let route of apiRoutes) {
    route.options = {
      isInternal: true
    };
    process.PhoenixBabel.gameServer.route(route);
  }
}
function loadWebRoutes() {
  for (let route of webRoutes) {
    process.PhoenixBabel.webServer.route(route);
  }
}

module.exports = {
  loadApiRoutes,
  loadWebRoutes
};
