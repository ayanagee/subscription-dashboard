import axios from "axios";

const api = axios.create({
  baseURL: "https://subscription-dashboard-izic.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
