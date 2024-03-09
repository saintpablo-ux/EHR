// Import necessary libraries
var CryptoJS = require("crypto-js");
var AES = require("crypto-js/aes");

// Function to encrypt a given AES key using a public key
export function encryptKey(pubkey, aeskey) {
    // Encrypt the AES key with the public key
    var cipherkey = CryptoJS.AES.encrypt(aeskey, pubkey);
    // Return the encrypted AES key as a string
    return cipherkey.toString();
}

// Function to decrypt an AES key using a private key
export function decryptKey(aeskey, privatekey) {
    // Decrypt the AES key using the private key
    var bytes = CryptoJS.AES.decrypt(aeskey, privatekey);
    // Convert the decrypted bytes to plaintext
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    // Return the plaintext AES key
    return plaintext;
}

// Function to convert a Uint8Array to a string
export function uintToString(uintArray) {
    // Decode the Uint8Array to a string using UTF-8 encoding
    var decodedStr = new TextDecoder("utf-8").decode(uintArray);
    // Return the decoded string
    return decodedStr;
}
