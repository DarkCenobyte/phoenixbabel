const {bufferize} = require('./utils.js');

const PROTOCOL_HEADERS = {
  NET_LINE_REP: [0x0A, 0x00, 0x00, 0x00],
  NET_ULIN: [0x13, 0x00, 0x00, 0x00],
  NET_STAT: [0x18, 0x00, 0x00, 0x00],
  NET_RUSO: [0x21, 0x02, 0x00, 0x00],
  NET_UNIK: [0x0F, 0x00, 0x00, 0x00],
  PRAY_PRAY: [0x09, 0x00, 0x00, 0x00]
};
const PROTOCOL_NET_LINE_REQ = 'NET: LINE_REQ';
const PROTOCOL_NET_ULIN = 'NET: ULIN';
const PROTOCOL_NET_STAT = 'NET: STAT';
const PROTOCOL_NET_RUSO = 'NET: RUSO';
const PROTOCOL_NET_UNIK = 'NET: UNIK';
const PROTOCOL_PRAY = 'PRAY: PRAY';
const PROTOCOL_UNKNOWN = 'UNKNOWN: UNKNOWN';
const PROTOCOL_EMPTY = 'EMPTY: EMPTY';

function buildPayload(payload) {
  // console.info('beforeBuilding', payload);
  return Buffer.from(
    [
      ...PROTOCOL_HEADERS[payload.head],
      ...payload.sessionToken,
      ...bufferize(payload.userId, 4),
      ...bufferize(0, 4),
      ...[0x00, 0x00, 0x00, 0x00], // counters
      ...bufferize(0, 20),
      ...bufferize(payload.body.length, 4), // length
      ...payload.body
    ]
  );
}

function respond(payload, socket) {
  if (! 'head' in payload) {
    console.error('Missing head attribute:', payload);
    throw new Exception('Invalid output payload, missing head attribute.');
  }
  const bufPayload = buildPayload(payload);
  //console.log(bufPayload);
  socket.write(bufPayload);
}

module.exports = {
  respond
}
