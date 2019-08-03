'use strict';

// Set to true for more verbose logs
const IS_DEBUG_ENABLED = true;

const serverConfig = require('./config/server.js');
const Hapi = require('@hapi/hapi');
const init = async () => {
  process.PhoenixBabel = {};
  process.PhoenixBabel.debug = IS_DEBUG_ENABLED;
  process.PhoenixBabel.gameServer = Hapi.server(
    {
      autoListen: false,
      host: serverConfig.docking.host,
      listener: require('net').Server({allowHalfOpen: true}).listen(
        serverConfig.docking
      )
    }
  );
  process.PhoenixBabel.webServer = Hapi.server(serverConfig.website);
  process.PhoenixBabel.gameServer.info.serverName = serverConfig.custom.gameServerFriendlyName;

  await require('./serverModules.js').init();
  await require('./db/mysql.js').init(serverConfig.db);
  await require('./prayReceiver.js').init();
  require('./routes.js').loadApiRoutes();
  require('./routes.js').loadWebRoutes();

  await Promise.all(
    [
      process.PhoenixBabel.gameServer.start(),
      process.PhoenixBabel.webServer.start()
    ]
  );

  console.log(`
    Servers up!
    Game API: ${process.PhoenixBabel.gameServer.info.uri}
    Website: ${process.PhoenixBabel.webServer.info.uri}
    `
  );
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();
