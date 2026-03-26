const fs = require("fs");
const path = require("path");

const publicKey = fs.readFileSync(
  path.join(__dirname, "../../keys/public.key"),
  "utf8"
);

console.log("Loaded public key");

module.exports = { publicKey };