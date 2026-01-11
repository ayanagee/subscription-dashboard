import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Subscriptions from "./pages/Subscriptions";
import Sidebar from "./components/Sidebar";
import "./index.css";

function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="app-layout">
      <Sidebar setPage={setPage} page={page} />
      <main className="main">
        {page === "dashboard" && <Dashboard />}
        {page === "subscriptions" && <Subscriptions />}
      </main>
    </div>
  );
}

export default App;
