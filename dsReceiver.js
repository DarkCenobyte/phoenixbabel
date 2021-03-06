const dsResponder = require('./dsResponder.js');
const { isSameArray } = require('./utils.js');

const PROTOCOL_NET_LINE_REQ = 'NET: LINE_REQ';
const PROTOCOL_USER_CHECK = 'USER: CHECK'; //0x10
const PROTOCOL_USER_CHECK_A = 'USER: CHECK_A'; //0x0d
const PROTOCOL_USER_CHECK_B = 'USER: CHECK_B'; //0x0e
const PROTOCOL_NET_ULIN = 'NET: ULIN';
const PROTOCOL_NET_STAT = 'NET: STAT';
const PROTOCOL_NET_RUSO = 'NET: RUSO';
const PROTOCOL_NET_UNIK = 'NET: UNIK';
const PROTOCOL_PRAY = 'PRAY: PRAY';
const PROTOCOL_UNKNOWN = 'UNKNOWN: UNKNOWN';
const PROTOCOL_EMPTY = 'EMPTY: EMPTY';

function isPray() {
  // TODO
}

function identifyNetBabelType(data) {
  if (data.length === 0) {
    console.log(PROTOCOL_EMPTY);
    return null;
  }
  const head = (data.slice(0x00, 0x04)).toJSON();
  if (isSameArray(head.data, [0x25, 0x00, 0x00, 0x00])) {
    console.log(PROTOCOL_NET_LINE_REQ);
    return PROTOCOL_NET_LINE_REQ;
  } else if (isSameArray(head.data, [0x10, 0x00, 0x00, 0x00])) {
    console.log(PROTOCOL_USER_CHECK);
    return PROTOCOL_USER_CHECK;
  } else if (isSameArray(head.data, [0x0D, 0x00, 0x00, 0x00])) {
    console.log(PROTOCOL_USER_CHECK_A);
    return PROTOCOL_USER_CHECK_A;
  } else if (isSameArray(head.data, [0x0E, 0x00, 0x00, 0x00])) {
    console.log(PROTOCOL_USER_CHECK_B);
    return PROTOCOL_USER_CHECK_B;
  } else if (isSameArray(head.data, [0x13, 0x00, 0x00, 0x00])) {
    console.log(PROTOCOL_NET_ULIN);
    return PROTOCOL_NET_ULIN;
  } else if (isSameArray(head.data, [0x18, 0x00, 0x00, 0x00])) {
    console.log(PROTOCOL_NET_STAT);
    return PROTOCOL_NET_STAT;
  } else if (isSameArray(head.data, [0x21, 0x02, 0x00, 0x00])) {
    console.log(PROTOCOL_NET_RUSO);
    return PROTOCOL_NET_RUSO;
  } else if (isSameArray(head.data, [0x21, 0x02, 0x00, 0x00])) {
    console.log(PROTOCOL_NET_UNIK);
    return PROTOCOL_NET_UNIK;
  } else if (isSameArray(head.data, [0x09, 0x00, 0x00, 0x00])) {
    console.log(PROTOCOL_PRAY);
    return PROTOCOL_PRAY;
  } else {
    console.warn(PROTOCOL_UNKNOWN, head);
    console.log('UNKNOWN PROTOCOL PAYLOAD', data.toJSON());
    return null;
  }
}

function parsePayload(payload) {
  switch (payload.type) {
    case PROTOCOL_NET_LINE_REQ:
      const userLength = payload.rawBuffer.slice(0x2C, 0x2C+4).readInt32LE() - 1;
      const passLength = payload.rawBuffer.slice(0x30, 0x30+4).readInt32LE() - 1;
      return {
        _relativePath: '/login',
        sessionToken: payload.rawBuffer.slice(0x04, 0x04+8).toString(),
        userId: payload.rawBuffer.slice(0x0C, 0x0C+4).toString(),
        user: payload.rawBuffer.slice(0x34, 0x34 + userLength).toString(),
        pass: payload.rawBuffer.slice(0x34 + userLength + 1, 0x34 + userLength + 1 + passLength).toString()
      };
      break;
    case PROTOCOL_NET_UNIK:
      // TODO
      return null;
      break;
    case PROTOCOL_NET_ULIN:
      // TODO
      return null;
      break;
    case PROTOCOL_NET_STAT:
      // TODO
      return null;
      break;
    case PROTOCOL_NET_RUSO:
      // TODO
      return null;
      break;
    case PROTOCOL_PRAY:
      // TODO
      return null;
      break;
    case PROTOCOL_USER_CHECK:
      // probably answered with 0x0d/0x0e only if something happen server-side
      return null;
      break;
    default:
      console.error('Should not be here...', payload.type);
      throw new Exception(`Unexpected payload parsed: ${payload.type}`);
  }
}

async function transmit(payload, socket) {
  const relativePath = payload._relativePath;
  delete payload['_relativePath'];
  const jsonPayload = JSON.stringify(payload);
  const res = await process.PhoenixBabel.gameServer.inject(
    {
      method: 'POST',
      url: relativePath,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": jsonPayload.length
      },
      payload: jsonPayload,
      allowInternals: true
    }
  );

  if ((res.payload || '').length > 0) {
    dsResponder.respond(JSON.parse(res.payload), socket);
  }
}

function processNetBabelPacket(data) {
  const payload = {
    type: identifyNetBabelType(data),
    rawBuffer: data
  };
  if (payload.type !== null) {
    payload.data = parsePayload(payload);
    return payload.data;
  }
  socket.end();
  return null;
}

function init() {
  // console.log(process.PhoenixBabel.gameServer.listener);
  // process.exit(1);
  process.PhoenixBabel.gameServer.listener.on(
    'connection',
    (socket) => {
      socket.setKeepAlive(true);
      socket.on(
        'close',
        () => {
          if (process.PhoenixBabel.debug === true)
            console.log('Closed Socket');
        }
      );
      socket.on(
        'data',
        async (data) => {
          const payload = processNetBabelPacket(data, socket);
          if (payload !== null) {
            await transmit(payload, socket);
          }
          socket.end();
        }
      );
      socket.once(
        'end',
        () => {
          if (process.PhoenixBabel.debug === true)
            console.log('End Socket');
        }
      );
      socket.on(
        'error',
        (err) => {
          console.error('ERROR SOCKET', err);
          socket.end();
        }
      );
    }
  );
  /*
  process.PhoenixBabel.gameServer.ext(
    {
      type: 'onRequest',
      method: function (request, h) {
        // Process prays
        console.log(request);
        console.log(h);
        process.exit(1);
      }
    }
  );
  */
}

module.exports = {
  init
};
