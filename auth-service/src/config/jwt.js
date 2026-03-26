const fs = require("fs");
const path = require("path");

const privateKeyPath = path.join(__dirname, "../../keys/private.key");
const publicKeyPath = path.join(__dirname, "../../keys/public.key");

if (!fs.existsSync(privateKeyPath)) {
  throw new Error("Private key not found. Generate RSA keys.");
}

if (!fs.existsSync(publicKeyPath)) {
  throw new Error("Public key not found. Generate RSA keys.");
}

const privateKey = fs.readFileSync(privateKeyPath, "utf8");
const publicKey = fs.readFileSync(publicKeyPath, "utf8");

module.exports = { privateKey, publicKey };