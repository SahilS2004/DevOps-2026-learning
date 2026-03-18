const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

// If credentials are not in env, we will use mock/fallback behavior
const isMock = !process.env.AWS_ACCESS_KEY_ID;

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummy',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy',
    sessionToken: process.env.AWS_SESSION_TOKEN
  }
});

const upload = multer({
  storage: isMock ? multer.memoryStorage() : multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME || 'dummy-bucket',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname)
    }
  })
});

module.exports = { upload, isMock };
