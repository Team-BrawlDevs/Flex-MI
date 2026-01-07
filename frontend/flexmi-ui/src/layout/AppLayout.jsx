import { NavLink, Outlet } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function AppLayout() {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>FlexMI</h2>

        <NavLink to="/dashboard" style={styles.link}>
          Dashboard
        </NavLink>

        <NavLink to="/simulate" style={styles.link}>
          Simulate
        </NavLink>
        {/* <NavLink to="/account" style={styles.link}>
          Linked Account
        </NavLink> */}

        <NavLink to="/timeline" style={styles.link}>
          EMI Timeline
        </NavLink>

        <button onClick={handleLogout} style={styles.button}>
          Log Out
        </button>
      </aside>

      {/* Main content (SCROLLS) */}
      <main style={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",          // 🔥 lock to viewport
    overflow: "hidden"        // 🔥 prevent page scroll
  },

  sidebar: {
    width: 240,
    background: "#0A2540",
    color: "#fff",
    padding: 24,
    flexShrink: 0,            // 🔥 prevent shrinking
    height: "100vh"           // 🔥 full height
  },

  logo: {
    marginBottom: 30
  },

  link: {
    display: "block",
    color: "#cbd5e1",
    marginBottom: 16,
    textDecoration: "none",
    fontSize: 15
  },

  button: {
    marginTop: 20,
    color: "white",
    background: "red",
    padding: "6px 10px",
    borderRadius: 4,
    border: "none",
    cursor: "pointer"
  },

  content: {
    flex: 1,
    background: "#f4f6f8",
    padding: 30,
    overflowY: "auto"         // ✅ ONLY THIS SCROLLS
  }
};
