const express = require("express");
const router = express.Router();
const db = require("../firebase");

// Process ONE new transaction
router.post("/process/:uid", async (req, res) => {
  const { uid } = req.params;
  const txn = req.body;

  try {
    const simRef = db.collection("simulation_state").doc(uid);
    const snap = await simRef.get();

    // 1️⃣ Get or initialize simulation state
    let state = snap.exists
      ? snap.data()
      : {
          closing_balance: 0,
          daily_inflow: 0,
          total_spent: 0,
          missed_emi_count: 1
        };

    // 2️⃣ Apply transaction
    state.closing_balance += txn.amount;

    if (txn.amount > 0) {
      state.daily_inflow += txn.amount;
    } else {
      state.total_spent += Math.abs(txn.amount);
    }

    // 3️⃣ Save updated simulation state
    await simRef.set({
      ...state,
      lastTxnAt: new Date()
    });

    // 4️⃣ TRIGGER EMI DECISION (🔥 THIS WAS MISSING)
    await fetch(`http://localhost:5000/api/emi/run/${uid}`, {
      method: "POST"
    });

    console.log("✅ Transaction processed & EMI updated for", uid);

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Transaction processing failed:", err);
    res.status(500).json({ error: "Transaction failed" });
  }
});

module.exports = router;
