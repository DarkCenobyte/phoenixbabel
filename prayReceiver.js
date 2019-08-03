const prayResponder = require('./prayResponder.js');

const PROTOCOL_NET_LINE_REQ = 'NET: LINE_REQ';
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

function isSameArray(src, trg) {
  if (src.length !== trg.length)
    return false;
  return src.every(
    (v, i) => {
      return v === trg[i];
    }
  );
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
      break;
    case PROTOCOL_NET_ULIN:
      // TODO
      break;
    case PROTOCOL_NET_STAT:
      // TODO
      break;
    case PROTOCOL_NET_RUSO:
      // TODO
      break;
    case PROTOCOL_PRAY:
      // TODO
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
    prayResponder.respond(res.payload, socket);
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
  return null;
}

function init() {
  process.PhoenixBabel.gameServer.listener.on(
    'connection',
    (socket) => {
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
          let payload = processNetBabelPacket(data);
          if (payload !== null) {
            await transmit(payload, socket);
          }
        }
      );
      socket.on(
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
