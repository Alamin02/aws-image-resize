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
  const images = getImagesByUserId(userId);

  res.json({ data: images });
});

router.post("/", uploadMiddleware.array("images"), (req, res) => {
  const { userId } = req.body;

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
});

module.exports = router;
