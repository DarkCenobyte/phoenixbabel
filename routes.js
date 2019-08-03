const apiRoutes = [
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'Hello World!';
    }
  },
  {
    method: 'POST',
    path: '/login',
    handler: (request, h) => {
      //console.log('ApiRoute/Login', request, h);
      return 'Hello World!';
    }
  }
];

const webRoutes = [
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return '<h1>Hello World!</h1>';
    }
  }
];

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
