const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

const bucketName = process.env.AWS_S3_BUCKET_NAME;
const isMock = !bucketName;

const s3Config = {
  region: process.env.AWS_REGION || 'us-east-1',
};

// Prefer explicit credentials for local development, otherwise let the AWS SDK
// resolve ECS task-role credentials automatically in production.
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  s3Config.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  };
}

const s3 = new S3Client(s3Config);

const upload = multer({
  storage: isMock
    ? multer.memoryStorage()
    : multerS3({
        s3: s3,
        bucket: bucketName,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
          cb(null, `books/${Date.now().toString()}-${file.originalname}`);
        },
      }),
});

module.exports = { upload, isMock };
