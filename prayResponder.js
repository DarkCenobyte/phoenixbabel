const PROTOCOL_NET_LINE_REQ = 'NET: LINE_REQ';
const PROTOCOL_NET_ULIN = 'NET: ULIN';
const PROTOCOL_NET_STAT = 'NET: STAT';
const PROTOCOL_NET_RUSO = 'NET: RUSO';
const PROTOCOL_NET_UNIK = 'NET: UNIK';
const PROTOCOL_PRAY = 'PRAY: PRAY';
const PROTOCOL_UNKNOWN = 'UNKNOWN: UNKNOWN';
const PROTOCOL_EMPTY = 'EMPTY: EMPTY';

function buildPayload(payload) {
  console.info('beforeBuilding', payload);
}

function respond(payload, socket) {
  const bufPayload = buildPayload(payload);
  // socket.write(bufPayload);
}

module.exports = {
  respond
}
