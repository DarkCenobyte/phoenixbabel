async function init(config) {
  const mysql = require('mysql');
  process.PhoenixBabel.db = mysql.createPool(config);
}

module.exports = {
  init
}
