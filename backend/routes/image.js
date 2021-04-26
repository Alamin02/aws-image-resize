const express = require("express");
const router = express.Router();

const {
  insertImage,
  getImagesByUserId,
  updateImage,
} = require("../services/database");
const { addToQueue } = require("../services/queue");
const uploadMiddleware = require("../middlewares/uploadImage");

router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  try {
    const images = getImagesByUserId(userId);
    res.json({ data: images });
  } catch (e) {
    res.status(500).json({ error: "Could not fetch data" });
  }
});

router.post("/", uploadMiddleware.array("images"), async (req, res) => {
  const { userId, resolution } = req.body;

  try {
    const addToQueuePromises = [];

    for (const file of req.files) {
      insertImage({
        userId,
        imageKey: file.key,
        processedUrl: null,
        resolution,
        mainUrl: file.location,
        size: file.size,
      });

      const [widthStr, heightStr] = resolution.split("×");

      addToQueuePromises.push(
        addToQueue({
          imageKey: file.key,
          s3url: file.location,
          widthStr,
          heightStr,
        })
      );
    }

    await Promise.all(addToQueuePromises);
    res.json({ msg: "Images added to queue" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not save image" });
  }
});

router.put("/", (req, res) => {
  const { processedUrl, imageKey } = req.body;

  try {
    updateImage(imageKey, "processed", processedUrl);
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
