const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Create an SQS service object
const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

const queueURL = process.env.SQS_IMAGE_QUEUE_URL;

function addToQueue({ imageKey, s3url, widthStr, heightStr }) {
  const params = {
    // Remove DelaySeconds parameter and value for FIFO queues
    DelaySeconds: 10,
    MessageAttributes: {
      imageKey: {
        DataType: "String",
        StringValue: imageKey,
      },
      s3url: {
        DataType: "String",
        StringValue: s3url,
      },
      width: {
        DataType: "Number",
        StringValue: widthStr,
      },
      height: {
        DataType: "Number",
        StringValue: heightStr,
      },
    },
    MessageBody: "Resize image",
    QueueUrl: queueURL,
  };

  return sqs.sendMessage(params).promise();
}

module.exports = { addToQueue };
