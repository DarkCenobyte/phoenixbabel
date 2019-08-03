async function init() {
  await process.PhoenixBabel.webServer.register(require('@hapi/inert'));
  await process.PhoenixBabel.webServer.register(require('@hapi/vision'));
}

module.exports = {
  init
};
