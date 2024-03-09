const ipfsClient = require('ipfs-http-client');
const pinataApiKey = 'bf97704cf121e29be6d3'; // replace with your actual Pinata API Key
const pinataSecretApiKey = 'fcae8bdc37ed6f1449dec5fdd7f99b2608fa7cd1a0097e10def37060874aa9e8'; // replace with your actual Pinata Secret API Key
const gatewayToken = '6JPYIe7ri1O52nkePDAlMKeneyMNvtZ3myh-rar0uLFZ4Li_PA586_OtSbuGbKmm'; // replace with your actual Pinata Secret API Key
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwNDQ4ZWMzNy1hMmE3LTQ5NDAtODZkYy1mMjE2ODJlYmVmMGIiLCJlbWFpbCI6ImJyaWFudDM3NzBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImJmOTc3MDRjZjEyMWUyOWJlNmQzIiwic2NvcGVkS2V5U2VjcmV0IjoiZmNhZThiZGMzN2VkNmYxNDQ5ZGVjNWZkZDdmOTliMjYwOGZhN2NkMWEwMDk3ZTEwZGVmMzcwNjA4NzRhYTllOCIsImlhdCI6MTcwNzA1NDg0Mn0.tjD7QP8ITgQmosb5ZZ43Eq5XgKv3sYgbwUqs5pc6tFs'

const ipfs = ipfsClient({
    host: 'red-tiny-crab-570.mypinata.cloud',
    port: 5001,
    protocol: 'https',
    headers: {
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
        'x-pinata-gateway-token': gatewayToken,
        Authorization: `Bearer ${JWT}`,
    },
});

export default ipfs;