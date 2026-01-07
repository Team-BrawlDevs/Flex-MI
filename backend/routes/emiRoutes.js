const express = require("express");
const router = express.Router();
const mlService = require("../services/mlService");
const decideEmi = require("../services/emiDecision");
const db = require("../firebase");

// Base defaults (used only if simulation_state does not exist)
const BASE_FINANCIALS = {
  closing_balance: 12000,
  daily_inflow: 5000,
  total_spent: 3000,
  missed_emi_count: 1,
  originalEmi: 1300
};

router.post("/run/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    /* --------------------------------------------------
       1️⃣ FETCH STATEFUL FINANCIAL DATA
    -------------------------------------------------- */
    const simRef = db.collection("simulation_state").doc(uid);
    const simSnap = await simRef.get();

    const FINANCIALS = simSnap.exists
      ? {
          closing_balance: simSnap.data().closing_balance,
          daily_inflow: simSnap.data().daily_inflow,
          total_spent: simSnap.data().total_spent,
          missed_emi_count: simSnap.data().missed_emi_count,
          balance_to_emi:
            simSnap.data().closing_balance / BASE_FINANCIALS.originalEmi,
          originalEmi: BASE_FINANCIALS.originalEmi
        }
      : {
          ...BASE_FINANCIALS,
          balance_to_emi:
            BASE_FINANCIALS.closing_balance / BASE_FINANCIALS.originalEmi
        };

    /* --------------------------------------------------
       2️⃣ CALL ML SERVICES
    -------------------------------------------------- */
    const pulse = await mlService.getPulseScore(FINANCIALS);
    const intent = await mlService.getIntentRisk(FINANCIALS);

    /* --------------------------------------------------
       3️⃣ NORMALIZE PULSE SCORE (0–10 → 0–100)
       🔥 SINGLE SOURCE OF TRUTH
    -------------------------------------------------- */
    const normalizedPulseScore = Math.round(
      Math.min(100, Math.max(0, pulse.pulse_score * 10))
    );

    /* --------------------------------------------------
       4️⃣ EMI DECISION (AFFORDABILITY‑AWARE)
    -------------------------------------------------- */
    const decision = decideEmi({
      pulseScore: normalizedPulseScore,
      intentRisk: intent.intent_risk,
      originalEmi: BASE_FINANCIALS.originalEmi,
      closingBalance: FINANCIALS.closing_balance
    });

    /* --------------------------------------------------
       5️⃣ WRITE EMI STATE (CONSISTENT DATA)
    -------------------------------------------------- */
    await db.collection("emi_state").doc(uid).set({
      uid,
      todayEmi: decision.emiAmount,
      originalEmi: BASE_FINANCIALS.originalEmi,
      pulseScore: normalizedPulseScore, // ✅ FIXED
      emiStatus: decision.emiStatus,
      reasonSummary: decision.reasonSummary,
      lastUpdated: new Date()
    });

    /* --------------------------------------------------
       6️⃣ WRITE EMI TIMELINE (HISTORY)
    -------------------------------------------------- */
    await db.collection("emi_timeline").add({
      uid,
      date: new Date().toISOString().slice(0, 10),
      emiAmount: decision.emiAmount,
      emiStatus: decision.emiStatus,
      pulseScore: normalizedPulseScore,
      reasons: decision.reasons,
      createdAt: new Date()
    });

    /* --------------------------------------------------
       7️⃣ NOTIFICATION
    -------------------------------------------------- */
    await db.collection("notifications").add({
      uid,
      category: "EMI",
      title: `EMI ${decision.emiStatus}`,
      message: decision.reasonSummary,
      read: false,
      createdAt: new Date()
    });

    /* --------------------------------------------------
       8️⃣ RESPONSE
    -------------------------------------------------- */
    res.json({
      pulseScore: normalizedPulseScore,
      intentRisk: intent.intent_risk,
      financialSnapshot: FINANCIALS,
      ...decision
    });

  } catch (err) {
    console.error("EMI ERROR:", err);
    res.status(500).json({ error: "EMI decision failed" });
  }
});

module.exports = router;
