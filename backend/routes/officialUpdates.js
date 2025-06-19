const express = require('express');
const router = express.Router();

// Mock implementation – scraping logic can be added later
router.get('/', async (req, res) => {
  try {
    // Example data simulating updates from FEMA, Red Cross, etc.
    const updates = [
      { source: "FEMA", message: "Flood alert in Manhattan", timestamp: new Date().toISOString() },
      { source: "Red Cross", message: "Shelters opened in Lower East Side", timestamp: new Date().toISOString() }
    ];

    res.json({ updates });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch official updates." });
  }
});

module.exports = router;
