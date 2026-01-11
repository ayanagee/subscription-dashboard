import { useEffect, useState } from "react";
import axios from "axios";

// ✅ ROOT API (Render)
const API_URL = "https://subscription-dashboard-izic.onrender.com";

function Dashboard() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/subscriptions`)
      .then(res => setSubs(res.data || []))
      .catch(err => console.error("Dashboard fetch error:", err));
  }, []);

  const today = new Date();

  /* ===== FILTERS ===== */
  const activeSubs = subs.filter(s => s.status === "Active");
  const expiredSubs = subs.filter(s => s.status === "Expired");

  /* ===== SPEND ===== */
  const totalSpend = activeSubs.reduce(
    (sum, s) => sum + Number(s.price || 0),
    0
  );

  const averageSpend =
    activeSubs.length > 0
      ? Math.round(totalSpend / activeSubs.length)
      : 0;

  /* ===== EXPIRING SOON ===== */
  const expiringSoon = activeSubs
    .map(s => {
      const renewal = new Date(s.renewalDate);
      if (isNaN(renewal)) return null;

      const daysLeft =
        (renewal - today) / (1000 * 60 * 60 * 24);

      return { ...s, daysLeft: Math.ceil(daysLeft) };
    })
    .filter(s => s && s.daysLeft >= 0 && s.daysLeft <= 7)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  /* ===== CATEGORY USAGE ===== */
  const categoryUsage = {};
  activeSubs.forEach(s => {
    categoryUsage[s.category] =
      (categoryUsage[s.category] || 0) + Number(s.price || 0);
  });

  return (
    <div className="page">
      {/* HEADER */}
      <div className="header">
        <div>
          <span className="muted">Welcome back</span>
          <h2>Ayana</h2>
        </div>
      </div>

      {/* STATS */}
      <div className="cards">
        <Stat title="Active Subscriptions" value={activeSubs.length} />
        <Stat title="Monthly Spend" value={`₹ ${totalSpend}`} />
        <Stat
          title="Average Spend / Subscription"
          value={`₹ ${averageSpend}`}
        />
        <Stat title="Expired Subscriptions" value={expiredSubs.length} />
      </div>

      <div className="dashboard-layout">
        {/* ===== USAGE INDICATOR ===== */}
        <div className="table-wrapper">
          <h4 className="mb-3">Subscription Usage Overview</h4>

          {Object.keys(categoryUsage).length === 0 ? (
            <p className="muted">No active subscriptions</p>
          ) : (
            Object.entries(categoryUsage).map(([category, amount]) => {
              const percentage =
                totalSpend > 0
                  ? Math.round((amount / totalSpend) * 100)
                  : 0;

              return (
                <div key={category} className="mb-3">
                  <div className="d-flex justify-content-between">
                    <strong>{category}</strong>
                    <span>₹ {amount}</span>
                  </div>

                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: "#6366f1",
                      }}
                    >
                      {percentage}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ===== ALERT PANEL ===== */}
        <div className="alert-panel">
          <h4>⚠ Expiring Soon</h4>

          {expiringSoon.length === 0 && (
            <p className="muted">No renewals in next 7 days</p>
          )}

          {expiringSoon.map(s => (
            <div key={s.id} className="alert-item">
              <strong>{s.name}</strong>
              <span>
                {s.daysLeft === 0
                  ? "Expires today"
                  : `Expires in ${s.daysLeft} days`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="card">
      <p className="muted">{title}</p>
      <h3>{value}</h3>
    </div>
  );
}

export default Dashboard;
