const express = require('express');
const router = express.Router();
const { fetchMockSocialMedia } = require('../services/socialMediaService');

module.exports = (io) => {
  router.get('/', async (req, res) => {
    const disasterId = req.originalUrl.split('/')[2];
    const response = await fetchMockSocialMedia(disasterId, io);
    res.json(response);
  });
  return router;
};
