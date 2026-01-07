function decideEmi({ pulseScore, intentRisk, originalEmi, closingBalance }) {
  let emiStatus = "NORMAL";
  let emiAmount = originalEmi;
  let reasons = [];

  // 🔴 High intent risk → pause
  if (intentRisk > 0.8) {
    emiStatus = "PAUSED";
    emiAmount = 0;
    reasons.push("High financial stress detected");
    reasons.push("EMI paused to prevent default");
  }

  // 🟡 Reduced EMI case
  else if (pulseScore < 60) {
    emiStatus = "REDUCED";

    // ✅ SAFE EMI LOGIC (KEY FIX)
    const maxAffordable = Math.floor(closingBalance * 0.4);

    emiAmount = Math.min(
      Math.round(originalEmi * 0.7),
      maxAffordable
    );

    // If even reduced EMI is unaffordable → pause
    if (emiAmount <= 0) {
      emiStatus = "PAUSED";
      emiAmount = 0;
      reasons.push("Insufficient balance to pay EMI");
    } else {
      reasons.push("Pulse score dropped below safe threshold");
      reasons.push("EMI reduced based on affordability");
    }
  }

  // 🟢 Normal EMI
  else {
    // Even in normal case, never exceed balance
    emiAmount = Math.min(originalEmi, Math.floor(closingBalance * 0.4));
    reasons.push("Stable cashflow detected");
    reasons.push("Normal EMI applied");
  }

  return {
    emiStatus,
    emiAmount,
    reasonSummary: reasons[0],
    reasons
  };
}

module.exports = decideEmi;
