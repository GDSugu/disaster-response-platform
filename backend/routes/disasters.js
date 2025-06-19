const express = require('express');
const router = express.Router();
const { getDisasters, createDisaster, updateDisaster, deleteDisaster } = require('../controllers/disasters');

module.exports = (io) => {
  router.get('/', getDisasters);
  router.post('/', (req, res) => createDisaster(req, res, io));
  router.put('/:id', (req, res) => updateDisaster(req, res, io));
  router.delete('/:id', (req, res) => deleteDisaster(req, res, io));
  return router;
};
