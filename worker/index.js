import Jimp from "jimp";
import path from "path";

const AWS = require("aws-sdk");

console.log(path.join(process.cwd(), ".env"))

require("dotenv").config({
  path: path.join(process.cwd(), ".env"),
});

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

const queueURL = "https://sqs.us-east-1.amazonaws.com/799513362811/im-homework";

var params = {
  AttributeNames: ["SentTimestamp"],
  MaxNumberOfMessages: 1,
  MessageAttributeNames: ["All"],
  QueueUrl: queueURL,
  VisibilityTimeout: 20,
  WaitTimeSeconds: 0,
};

// const samplePath = path.join(__dirname, "sample", "sample.jpg");

async function processImage(width, height) {
  const image = await Jimp.read(samplePath)
    .then((image) => {
      return image.resize(width, height).getBufferAsync(image.getMIME());
    })
    .catch((err) => {
      console.error(err);
    });

  console.log(image);

  return image;
}

// process(320, 200);

async function runner() {
  while (true) {
    try {
      const data = await sqs.receiveMessage(params).promise();
      console.log(data);

      if (data.Messages) {
        const deleteParams = {
          QueueUrl: queueURL,
          ReceiptHandle: data.Messages[0].ReceiptHandle,
        };

        // TODO: Add image processing here

        await sqs.deleteMessage(deleteParams).promise();
      }
    } catch (e) {
      console.error(e);
    }
  }
}

runner();
