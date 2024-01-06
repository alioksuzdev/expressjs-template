const dynamoose = require('dynamoose');

const app = require('./src/app');

const fileAdapter = require('./src/v1/adapters/fileAdapter');

const {
  PORT = 3000,
  AWS_DYNAMODB_ACCESS_KEY,
  AWS_DYNAMODB_SECRET_KEY,
  AWS_S3_BUCKET,
  AWS_S3_ACCESS_KEY,
  AWS_S3_SECRET_KEY,
  AWS_S3_ENDPOINT,
} = process.env;

(async () => {
  try {
    dynamoose.aws.ddb.set(new dynamoose.aws.ddb.DynamoDB({
      credentials: {
        accessKeyId: AWS_DYNAMODB_ACCESS_KEY,
        secretAccessKey: AWS_DYNAMODB_SECRET_KEY,
      },
      region: 'eu-west-1',
    }));
    // emailAdapter.setup(EMAIL_ADDRESS, EMAIL_PASSWORD, EMAIL_SMTP_SERVER, EMAIL_PORT);
    fileAdapter.setup(AWS_S3_ACCESS_KEY, AWS_S3_SECRET_KEY, AWS_S3_ENDPOINT, AWS_S3_BUCKET);

    return app.listen(PORT, (error) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return process.exit(1);
      }
      // eslint-disable-next-line no-console
      return console.info(`Server started at port: ${PORT}`);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return process.exit(1);
  }
})();
