const {bufferize, dbQuery} = require('../../utils.js');
const {randomBytes} = require('crypto');

const SERVER_ID = 1;
const SERVER_PORT = process.PhoenixBabel.gameServer.info.port;
const SERVER_HOST = process.PhoenixBabel.gameServer.info.host;
const SERVER_FRIENDLY_NAME = process.PhoenixBabel.gameServer.info.serverName;
module.exports = async function (request, h) {
  console.log('Login Request');

  // CHECK IDENTITY HERE
  const user = await dbQuery(`
    SELECT id
    FROM users
    WHERE username = ? AND gamepassword = ?
    LIMIT 1;
    `,
    [request.user, request.pass]
  );
  if (user.length === 0) {
    // invalid username or password
    return {
      head: 'NET_LINE_REP',
      sessionToken: [...bufferize(0x00, 8)],
      userId: 0,
      body: [
        ...bufferize(0x00, 12)
      ]
    };
  }

  // currently this random sessionToken is not stored
  const sessionToken = [...randomBytes(8)];
  const userId = user[0].id; // get from db
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
