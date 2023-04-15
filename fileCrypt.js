const crypto = require('crypto');
const fs = require('fs');
const algorithm = 'aes-256-ctr';

export async function encryptFile(filename, key) {
  key = await crypto.createHash('sha256').update(String(key)).digest('base64').substr(0, 32);
  const iv = await crypto.randomBytes(16);
  const cipher = await crypto.createCipheriv(algorithm, key, iv);
  var data = await fs.readFileSync(filename);
  const encBuffer = await Buffer.concat([iv, cipher.update(data), cipher.final()]);
  await fs.writeFileSync(filename, encBuffer)
}

export async function decryptFile(filename, key) {
  key = await crypto.createHash('sha256').update(String(key)).digest('base64').substr(0, 32);
  let encryptedData = await fs.readFileSync(filename);
  const iv = await encryptedData.slice(0, 16);
  encryptedData = await encryptedData.slice(16);
  const decipher = await crypto.createDecipheriv(algorithm, key, iv);
  const result = await Buffer.concat([decipher.update(encryptedData), decipher.final()]);
  await fs.writeFileSync(filename, result)
}