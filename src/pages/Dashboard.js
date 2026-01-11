import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Chart from "chart.js/auto";

function Dashboard() {
  const [subs, setSubs] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:3002/subscriptions")
      .then(res => setSubs(res.data));
  }, []);

  const today = new Date();

  /* ===== STATS ===== */
  const active = subs.filter(s => s.status === "Active").length;
  const expired = subs.filter(s => s.status === "Expired").length;

  const spend = subs
    .filter(s => s.status === "Active")
    .reduce((sum, s) => sum + Number(s.price), 0);

  /* ===== EXPIRING SOON ===== */
  const expiringSoon = subs
    .filter(s => s.status === "Active")
    .map(s => {
      const diff =
        (new Date(s.renewalDate) - today) / (1000 * 60 * 60 * 24);
      return { ...s, daysLeft: Math.ceil(diff) };
    })
    .filter(s => s.daysLeft >= 0 && s.daysLeft <= 7)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  /* ===== CHART ===== */
  useEffect(() => {
    if (!chartRef.current) return;

    const categoryMap = {};
    subs.forEach(s => {
      if (s.status === "Active") {
        categoryMap[s.category] =
          (categoryMap[s.category] || 0) + Number(s.price);
      }
    });

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: Object.keys(categoryMap),
        datasets: [
          {
            label: "Monthly Spend (₹)",
            data: Object.values(categoryMap),
            backgroundColor: "#6366f1",
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }, [subs]);

  return (
    <div className="page">
      <div className="header">
        <div>
          <span>Welcome back</span>
          <h2>Ayana</h2>
        </div>
      </div>

      <div className="dashboard-layout">
        <div>
          <div className="cards">
            <Stat title="Active Subscriptions" value={active} />
            <Stat title="Monthly Spend" value={`₹ ${spend}`} />
            <Stat title="Upcoming Renewals" value={expiringSoon.length} />
            <Stat title="Expired Subscriptions" value={expired} />
          </div>

          <div className="table-wrapper" style={{ marginTop: 24 }}>
            <h4 style={{ marginBottom: 16 }}>
              Subscription Spend by Category
            </h4>
            <canvas ref={chartRef} height="120"></canvas>
          </div>
        </div>

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
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
  );
}

export default Dashboard;
