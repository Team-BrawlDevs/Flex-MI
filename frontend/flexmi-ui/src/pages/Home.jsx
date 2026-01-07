import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>FlexMI</h1>
        <p style={styles.subtitle}>
          Smart, cashflow‑aware EMI management designed to support you during real financial situations.
        </p>

        <div style={styles.buttonGroup}>
          <Link to="/login">
            <button style={styles.primaryBtn}>Login</button>
          </Link>
          <Link to="/signup">
            <button style={styles.secondaryBtn}>Sign Up</button>
          </Link>
        </div>
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
    padding: 20
  },
  card: {
    maxWidth: 420,
    width: "100%",
    background: "#ffffff",
    padding: 32,
    borderRadius: 16,
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
  },
  title: {
    fontSize: 36,
    color: "#0A2540",
    fontWeight: 700
  },
  subtitle: {
    marginTop: 16,
    fontSize: 15,
    color: "#475569",
    lineHeight: 1.6
  },
  buttonGroup: {
    marginTop: 32,
    display: "flex",
    flexDirection: "column",
    gap: 12
  },
  primaryBtn: {
    background: "#0A2540",
    color: "#fff",
    padding: 14,
    borderRadius: 10,
    fontSize: 16
  },
  secondaryBtn: {
    background: "#00B4A6",
    color: "#fff",
    padding: 14,
    borderRadius: 10,
    fontSize: 16
  }
};
