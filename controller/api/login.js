const {bufferize} = require('../../utils.js');

const SERVER_ID = 1;
const SERVER_PORT = process.PhoenixBabel.gameServer.info.port;
const SERVER_HOST = process.PhoenixBabel.gameServer.info.host;
const SERVER_FRIENDLY_NAME = process.PhoenixBabel.gameServer.info.serverName;
module.exports = async function (request, h) {
  console.log('Login Request');

  // CHECK IDENTITY HERE

  // if valid:
  const sessionToken = [0x66, 0x60, 0x01, 0x01, 0x1, 0x01, 0x01, 0x01]; // make random
  const userId = 1; // get from db
  return {
    head: 'NET_LINE_REP',
    sessionToken: sessionToken,
    userId: userId,
    body: [
      ...[0x00, 0x00, 0x00, 0x00],
      ...[0x00, 0x00, 0x00, 0x00],
      ...[0x00, 0x00, 0x00, 0x00],
      ...bufferize(SERVER_PORT, 4),
      ...bufferize(SERVER_ID, 4),
      SERVER_HOST,
      0x00,
      SERVER_FRIENDLY_NAME,
      0x00
    ]
  };
}
