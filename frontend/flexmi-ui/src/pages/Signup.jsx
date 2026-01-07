import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState("Salaried");

  // Step 3
  const [consent, setConsent] = useState(false);

  const createAccount = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", userCred.user.uid), {
        uid: userCred.user.uid,
        email,
        fullName,
        phone,
        userType,
        consentGiven: true,
        createdAt: serverTimestamp()
      });

      setStep(4);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Progress */}
        <p style={styles.progress}>Step {step} of 4</p>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2>Create Account</h2>
            <p style={styles.sub}>Secure access to PulsePay</p>

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button style={styles.primaryBtn} onClick={() => setStep(2)}>
              Continue
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2>Basic Profile</h2>
            <p style={styles.sub}>Tell us a bit about you</p>

            <input
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <select
              style={styles.select}
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option>Salaried</option>
              <option>Gig / Freelancer</option>
              <option>MSME</option>
            </select>

            <button style={styles.primaryBtn} onClick={() => setStep(3)}>
              Continue
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h2>Consent & Trust</h2>
            <p style={styles.sub}>
              PulsePay accesses financial data only with your consent.
            </p>

            <label style={styles.checkbox}>
              <input
                type="checkbox"
                checked={consent}
                onChange={() => setConsent(!consent)}
              />
              I agree to Terms, Privacy Policy & secure data usage
            </label>

            <button
              style={{
                ...styles.primaryBtn,
                opacity: consent ? 1 : 0.5
              }}
              disabled={!consent}
              onClick={createAccount}
            >
              Create Account
            </button>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <h2>Account Created 🎉</h2>
            <p style={styles.sub}>
              Your PulsePay account is ready.
            </p>

            <button
              style={styles.primaryBtn}
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    padding: 28,
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
  },
  progress: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 8
  },
  sub: {
    marginBottom: 20,
    color: "#64748B",
    fontSize: 14
  },
  primaryBtn: {
    marginTop: 20,
    width: "100%",
    background: "#0A2540",
    color: "#fff",
    padding: 14,
    borderRadius: 10,
    fontSize: 15
  },
  select: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #CBD5E1",
    marginTop: 10
  },
  checkbox: {
    display: "flex",
    gap: 8,
    fontSize: 14,
    alignItems: "center"
  }
};
