require('dotenv').config()
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");

const account = process.env.STORAGE_ACCOUNT
const accountKey = process.env.STORAGE_ACCOUNT_KEY

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    sharedKeyCredential
);

const containerName = process.env.STORAGE_ACCOUNT_CONTAINER;

exports.setContentType = async (contentType) => {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    let blobs = containerClient.listBlobsFlat();
    for await (const blob of blobs) {
        if (blob.properties.contentType && blob.properties.contentType !== contentType) {
            const blobClient = containerClient.getBlobClient(blob.name);
            blobClient.setHTTPHeaders({ blobContentType: contentType })
        }
    }
}

this.setContentType('application/octet-stream')