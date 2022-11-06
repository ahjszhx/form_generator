import CryptoJS from "crypto-js";

var key = CryptoJS.enc.Utf8.parse("1u82lda58fd944kk");
const options = {
  mode: CryptoJS.mode.ECB,
  padding: CryptoJS.pad.Pkcs7
};

export function encrypt(word) {
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, options);
  return encrypted.ciphertext.toString();
}

export function decrypt(word) {
  return CryptoJS.AES.decrypt(
    CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(word)),
    key,
    options
  ).toString(CryptoJS.enc.Utf8);
}
