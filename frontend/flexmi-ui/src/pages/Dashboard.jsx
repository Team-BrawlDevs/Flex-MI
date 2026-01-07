import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import EmiLineChart from "../components/EmiLineChart";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [emi, setEmi] = useState(null);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      /* ---------------------------
         1️⃣ Fetch EMI STATE
      ---------------------------- */
      const ref = doc(db, "emi_state", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) setEmi(snap.data());

      /* ---------------------------
         2️⃣ Fetch TODAY'S EMI TIMELINE
      ---------------------------- */
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const q = query(
        collection(db, "emi_timeline"),
        where("uid", "==", user.uid),
        
      );

      const tSnap = await getDocs(q);

      const todayTimeline = tSnap.docs
        .map(d => {
          const data = d.data();
          if (!data.createdAt) return null;

          let dateObj;

          // Firestore Timestamp
          if (data.createdAt.toDate) {
            dateObj = data.createdAt.toDate();
          }
          // JS Date
          else if (data.createdAt instanceof Date) {
            dateObj = data.createdAt;
          }
          // string / number fallback
          else {
            dateObj = new Date(data.createdAt);
          }

          if (isNaN(dateObj.getTime())) return null;

          return {
            time: dateObj.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            }),
            emiAmount: data.emiAmount
          };
        })
        .filter(Boolean);

      setTimeline(todayTimeline);
      console.log("EMI TIMELINE POINTS:", todayTimeline);
    };

    fetchData();
  }, [user]);

  if (!emi) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
  <h1>
    Hi {user.displayName || "Sai Pranav"} 👋
  </h1>
  <span className="subtitle">Welcome to FlexMI</span>
</header>

      {/* EMI Card */}
      <div className="card emi-card">
        <div className="emi-top">
          <div>
            <p className="label">Today’s EMI</p>
            <h2>₹{emi.todayEmi}</h2>
          </div>

          <span className={`status ${emi.emiStatus.toLowerCase()}`}>
            {emi.emiStatus}
          </span>
        </div>

        <p className="original">
          Original EMI: ₹{emi.originalEmi}
        </p>

        <div className="divider" />

        <p className="reason">
          {emi.reasonSummary}
        </p>

        <p className="updated">
          Last updated:{" "}
          {new Date(emi.lastUpdated.seconds * 1000).toLocaleTimeString()}
        </p>
      </div>

      {/* Pulse Score */}
      <div className="card pulse-card">
        <p className="label">Cashflow Pulse Score</p>
        <h2>{emi.pulseScore}</h2>

        <div className="progress">
          <div
            className="progress-bar"
            style={{ width: `${emi.pulseScore}%` }}
          />
        </div>
      </div>

      {/* EMI Decision Trend */}
      <div className="card chart-card">
        <p className="label">Today’s EMI Decision Trend</p>

        {timeline.length >= 2 ? (
          <EmiLineChart timeline={timeline} />
        ) : (
          <p className="muted">
            Not enough EMI decision points for today
          </p>
        )}
      </div>
    </div>
  );
}
