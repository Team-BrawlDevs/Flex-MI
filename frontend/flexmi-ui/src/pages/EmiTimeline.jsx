import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from "firebase/firestore";
import { db } from "../firebase";

export default function EmiTimeline() {
  const { user } = useAuth();
  const [grouped, setGrouped] = useState({});

  useEffect(() => {
    const fetchTimeline = async () => {
      const q = query(
        collection(db, "emi_timeline"),
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);

      const groupedData = {};

      snap.docs.forEach(doc => {
        const data = doc.data();
        const dateObj = data.createdAt.toDate();

        const date = dateObj.toDateString(); // e.g. "Sun Dec 28 2025"
        const time = dateObj.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        });

        if (!groupedData[date]) {
          groupedData[date] = [];
        }

        groupedData[date].push({
          ...data,
          time
        });
      });

      setGrouped(groupedData);
    };

    fetchTimeline();
  }, [user.uid]);

  return (
    <div>
      <h2>EMI Timeline</h2>
      <p style={{ color: "#64748b", marginBottom: 20 }}>
        EMI decisions grouped by date with timestamps
      </p>

      {Object.keys(grouped).map(date => (
        <div key={date} style={{ marginBottom: 30 }}>
          {/* DATE HEADER */}
          <h4 style={styles.dateHeader}>{date}</h4>

          {/* EMI CARDS */}
          {grouped[date].map((item, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.header}>
                <span style={styles.time}>{item.time}</span>
                <span style={badge(item.emiStatus)}>
                  {item.emiStatus}
                </span>
              </div>

              <p><b>EMI:</b> ₹{item.emiAmount}</p>
              <p style={styles.reason}>{item.reasons?.[0]}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const styles = {
  dateHeader: {
    marginBottom: 12,
    color: "#0A2540",
    fontWeight: 700
  },
  card: {
    background: "#fff",
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 6
  },
  time: {
    fontSize: 13,
    color: "#475569"
  },
  reason: {
    color: "#475569",
    fontSize: 14
  }
};

const badge = (status) => ({
  padding: "4px 10px",
  borderRadius: 12,
  fontSize: 12,
  background:
    status === "NORMAL"
      ? "#DCFCE7"
      : status === "REDUCED"
      ? "#FEF3C7"
      : "#FEE2E2",
  color:
    status === "NORMAL"
      ? "#166534"
      : status === "REDUCED"
      ? "#92400E"
      : "#991B1B"
});
