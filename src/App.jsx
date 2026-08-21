import { useState, useEffect } from "react";

const API = "http://localhost:4001/api";

export default function App() {
  const [eggs, setEggs] = useState([]);
  const [count, setCount] = useState("");

  async function refresh() {
    const res = await fetch(`${API}/eggs`);
    const data = await res.json();
    setEggs(data);
  }

  useEffect(() => { refresh(); }, []);

  async function logEggs(e) {
    e.preventDefault();
    await fetch(`${API}/eggs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count: Number(count) })
    });
    setCount("");
    refresh();
  }

  async function deleteEgg(id) {
    await fetch(`${API}/eggs/${id}`, { method: "DELETE" });
    refresh();
  }

  return (
    <main style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif", padding: 20 }}>
      <h1>🦆 QuackTrack</h1>
      <h2>Egg Log 🥚</h2>

      <form onSubmit={logEggs} style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          placeholder="How many eggs today?"
          min="0"
          required
          style={{ padding: 12, fontSize: 16, flex: 1, border: "1px solid #ddd", borderRadius: 6 }}
        />
        <button 
          type="submit" 
          style={{ padding: "12px 24px", fontSize: 16, background: "#2b50aa", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: "bold" }}
        >
          Log
        </button>
      </form>

      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
        {eggs.length === 0 && <li style={{ color: "#777", textAlign: "center", padding: 20 }}>No eggs logged yet. The ducks are resting.</li>}
        {eggs.map((e) => (
          <li key={e.id} style={{ padding: 15, background: "#f4f4f6", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{e.date}: <b>{e.count}</b> eggs</span>
            <button 
              onClick={() => deleteEgg(e.id)} 
              style={{ background: "#ff4444", color: "white", border: "none", borderRadius: 4, padding: "6px 12px", cursor: "pointer", fontWeight: "bold" }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
