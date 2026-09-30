import { createECDH } from "node:crypto";

let ecdh;
// La clé privée doit faire exactement 32 octets (format JWK).
do {
  ecdh = createECDH("prime256v1");
  ecdh.generateKeys();
} while (ecdh.getPrivateKey().length !== 32);

console.log(`NUXT_PUBLIC_VAPID_PUBLIC_KEY=${ecdh.getPublicKey().toString("base64url")}`);
console.log(`NUXT_VAPID_PRIVATE_KEY=${ecdh.getPrivateKey().toString("base64url")}`);
