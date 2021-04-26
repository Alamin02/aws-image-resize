import Jimp from "jimp";
import fetch from "node-fetch";

const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

const S3 = new AWS.S3();

const queueURL = process.env.SQS_IMAGE_QUEUE_URL;

const queueParams = {
  AttributeNames: ["SentTimestamp"],
  MaxNumberOfMessages: 1,
  MessageAttributeNames: ["All"],
  QueueUrl: queueURL,
  VisibilityTimeout: 20,
  WaitTimeSeconds: 20,
};

async function processImage(image, width, height) {
  return Jimp.read(image).then((image) => {
    return image.resize(width, height).getBufferAsync(image.getMIME());
  });
}

async function updateStatus(imageKey, status, processedUrl = null) {
  await fetch("http://localhost:4000/api/v1/images/", {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      processedUrl,
      imageKey,
      status,
    }),
  });
}

async function runner() {
  while (true) {
    try {
      // Get data from SQS
      const data = await sqs.receiveMessage(queueParams).promise();

      if (data.Messages) {
        // Get the first message - as there will be one message only
        // As MaxNumberOfMessages is set to 1
        const message = data.Messages[0];
        const messageAttributes = message.MessageAttributes;
        const originalImageKey = messageAttributes.imageKey.StringValue;

        // Get original image object from S3
        const originalImageObject = await S3.getObject({
          Bucket: "im-homework",
          Key: originalImageKey,
        }).promise();

        const width = parseInt(messageAttributes.width.StringValue, 10);
        const height = parseInt(messageAttributes.height.StringValue, 10);

        try {
          // Resize image
          const processedImage = await processImage(
            originalImageObject.Body,
            width,
            height
          );

          // Upload resized image to s3 bucket
          const uploadedObject = await S3.upload({
            Bucket: "im-homework",
            Key: `resized-${messageAttributes.imageKey.StringValue}`,
            ContentType: originalImageObject.ContentType,
            Tagging: "public=yes",
            Body: processedImage,
          }).promise();

          await updateStatus(
            originalImageKey,
            "processed",
            uploadedObject.Location
          );
        } catch (e) {
          console.error(e);
          await updateStatus(originalImageKey, "failed");
        }

        // Delete message from queue
        const deleteParams = {
          QueueUrl: queueURL,
          ReceiptHandle: data.Messages[0].ReceiptHandle,
        };

        await sqs.deleteMessage(deleteParams).promise();
      }
    } catch (e) {
      console.error(e);
    }
  }
}

runner();
