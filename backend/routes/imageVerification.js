const express = require('express');
const router = express.Router();
const { verifyImageWithGemini } = require('../services/imageVerificationService');

router.post('/', async (req, res) => {
  const { image_url } = req.body;
  if (!image_url) return res.status(400).json({ error: "Image URL is required" });

  const result = await verifyImageWithGemini(image_url);
  if (result.error) return res.status(500).json(result);
  res.json(result);
});

module.exports = router;
