const express = require("express");
const router = express.Router();

const metaStore = {};

// GET pointer
router.get("/:uid", (req, res) => {
  const { uid } = req.params;
  res.json(metaStore[uid] || { lastProcessedTxnIndex: -1 });
});

// POST update pointer
router.post("/:uid", (req, res) => {
  const { uid } = req.params;
  const { lastProcessedTxnIndex } = req.body;

  metaStore[uid] = { lastProcessedTxnIndex };
  res.json({ success: true });
});

module.exports = router;
