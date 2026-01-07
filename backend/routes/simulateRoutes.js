const express = require("express");
const router = express.Router();
const db = require("../firebase");

const BASE_FINANCIALS = {
  daily_inflow: 5000,
  total_spent: 3000,
  closing_balance: 12000,
  missed_emi_count: 1
};

router.post("/:uid", async (req, res) => {
  const { uid } = req.params;
  const {
    closing_balance,
    daily_inflow,
    total_spent,
    missed_emi_count
  } = req.body;

  await db.collection("simulation_state").doc(uid).set({
    closing_balance,
    daily_inflow,
    total_spent,
    missed_emi_count,
    updatedAt: new Date()
  });

  res.json({ message: "Financial state updated" });
});

module.exports = router;
