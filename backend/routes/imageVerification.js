const express = require('express');
const router = express.Router();
const { verifyImageWithGemini } = require('../services/imageVerificationService');

router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { image_url } = req.body;

  if (!image_url) return res.status(400).json({ error: "Image URL is required" });

  console.log(`🔍 Verifying image for disaster ID ${id}...`);

  const result = await verifyImageWithGemini(image_url);
  if (result.error) return res.status(500).json(result);
  
  res.json({ ...result, disaster_id: id });
});


module.exports = router;
