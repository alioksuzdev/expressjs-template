const AWS = require('aws-sdk');
const idUtils = require('../utils/idUtils');

let s3;
let bucket;

module.exports = {
  setup(accessKey, secretKey, endpoint, bucketName) {
    bucket = bucketName;

    s3 = new AWS.S3({
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
      endpoint: endpoint,
    });
  },

  async uploadFile(fileData, mimeType, clientId) {
    const fileName = `${clientId}-${idUtils.generateId()}.${mimeType.split('/')[1]}`;
    const file = {
      Bucket: bucket,
      Key: fileName,
      Body: fileData,
      ContentType: mimeType,
      Metadata: {
        'Content-Type': mimeType,
      },
    };
    await s3.upload(file).promise();
    return { fileName, url: `https://cdn.pleebapp.com/${fileName}` };
  },

  async deleteFile(fileName) {
    const params = { Key: fileName };

    return s3.deleteObject(params).promise();
  },
};
