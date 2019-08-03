function bufferize(value, size = null) {
  if (
    [
      'undefined',
      'object',
      'boolean',
      'symbol',
      'function',
      'bigint'
    ].includes(typeof value)
  ) {
    throw new Error(
      `
      Utils.bufferize : Unbufferizable value input.
      Input type: ${typeof value}
      `
    );
  }
  if (size === null) {
    size = value.toString(16).length;
  }
  return new Buffer.alloc(size).fill(value, 0, value.toString(16).length);
}

function hexArray(value, size = null) {
  return [...bufferize(value, size)];
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

module.exports = {
  bufferize,
  hexArray,
  isSameArray
}
