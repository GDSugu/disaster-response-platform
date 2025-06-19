const express = require('express');
const router = express.Router();
const { extractLocationAndGeocode } = require('../services/geocodeService');

router.post('/', async (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ error: "Description is required" });
  }

  const result = await extractLocationAndGeocode(description);
  if (result.error) return res.status(500).json(result);
  res.json(result);
});

module.exports = router;
