var crypto = require('crypto');

// Function to generate random bytes
export function generate() {
    // Generate 256 random bytes
    const buf = crypto.randomBytes(256);
    // Return the generated buffer
    return buf;
}
