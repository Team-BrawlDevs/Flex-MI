import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Firebase Auth login
      const res = await signInWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;

      // 2️⃣ Fetch user profile from Firestore
      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);

      // 3️⃣ Decide navigation
      if (snap.exists() && snap.data().bankConnected) {
        navigate("/dashboard");       // Returning user
      } else {
        navigate("/connect-bank");    // First-time user
      }

    } catch (err) {
      console.error(err);
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Welcome Back</h2>
        <p style={styles.sub}>Login to FlexMI</p>

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

        <button
          style={styles.primaryBtn}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={styles.footer}>
          New user? <Link to="/signup">Create account</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    background: "#f4f6f8"
  },
  card: {
    width: "100%",
    maxWidth: 400,
    background: "#fff",
    padding: 28,
    borderRadius: 14,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
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
    fontSize: 15,
    cursor: "pointer"
  },
  footer: {
    marginTop: 16,
    fontSize: 13,
    textAlign: "center"
  }
};
