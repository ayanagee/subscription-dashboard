function Sidebar({ page, setPage }) {
    return (
      <aside className="sidebar">
        <h2 className="logo">SubTrack</h2>
  
        <nav>
          <div
            className={`nav-item ${page === "dashboard" ? "active" : ""}`}
            onClick={() => setPage("dashboard")}
          >
            Dashboard
          </div>
  
          <div
            className={`nav-item ${page === "subscriptions" ? "active" : ""}`}
            onClick={() => setPage("subscriptions")}
          >
            Subscriptions
          </div>
        </nav>
      </aside>
    );
  }
  
  export default Sidebar;
  