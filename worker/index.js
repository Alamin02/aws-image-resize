import Jimp from "jimp";
import path from "path";

const AWS = require("aws-sdk");

const samplePath = path.join(__dirname, "sample", "sample.jpg");

async function processImage(width, height) {
  const image = await Jimp.read(samplePath)
    .then((image) => {
      return image.resize(width, height).getBufferAsync(image.getMIME());
    })
    .catch((err) => {
      console.error(err);
    });

  console.log(image);
}

process(320, 200);
