const express = require("express");
const router = express.Router();

const {
  insertImage,
  getImagesByUserId,
  updateImage,
} = require("../services/image");

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

router.post("/", uploadMiddleware.array("images"), (req, res) => {
  const { userId } = req.body;

  try {
    for (const file of req.files) {
      insertImage({
        userId,
        imageKey: file.key,
        processedUrl: null,
        mainUrl: file.location,
        size: file.size,
      });
    }
    res.json({ msg: "Images added to queue" });
  } catch (e) {
    res.status(500).json({ error: "Could not save image" });
  }
});

module.exports = router;
