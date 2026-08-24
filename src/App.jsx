import { useState, useEffect } from "react";

const API = "http://localhost:4001/api";

const card = { padding: 15, background: "#f4f4f6", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 };
const btn = (bg) => ({ background: bg, color: "#fff", border: "none", borderRadius: 6, padding: "10px 18px", cursor: "pointer", fontWeight: "bold" });
const input = { padding: 10, border: "1px solid #ddd", borderRadius: 6, fontSize: 15 };
const list = { listStyle: "none", padding: 0, display: "grid", gap: 10 };

function EggsPage() {
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState("");

  async function refresh() {
    setRows(await (await fetch(`${API}/eggs`)).json());
  }
  useEffect(() => { refresh(); }, []);

  async function log(e) {
    e.preventDefault();
    await fetch(`${API}/eggs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count: Number(count) }),
    });
    setCount("");
    refresh();
  }

  async function del(id) {
    await fetch(`${API}/eggs/${id}`, { method: "DELETE" });
    refresh();
  }

  return (
    <>
      <form onSubmit={log} style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input type="number" min="0" required value={count} placeholder="How many eggs today?"
          onChange={(e) => setCount(e.target.value)} style={{ ...input, flex: 1 }} />
        <button style={btn("#2b50aa")}>Log 🥚</button>
      </form>
      <ul style={list}>
        {rows.map((r) => (
          <li key={r.id} style={card}>
            <span>{r.date}: <b>{r.count}</b> eggs</span>
            <button onClick={() => del(r.id)} style={btn("#e04444")}>✕</button>
          </li>
        ))}
      </ul>
    </>
  );
}

function ExpensesPage() {
  const [rows, setRows] = useState([]);
  const [item, setItem] = useState("");
  const [cost, setCost] = useState("");

  async function refresh() {
    setRows(await (await fetch(`${API}/expenses`)).json());
  }
  useEffect(() => { refresh(); }, []);

  async function log(e) {
    e.preventDefault();
    await fetch(`${API}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item, cost: Number(cost) }),
    });
    setItem("");
    setCost("");
    refresh();
  }

  async function del(id) {
    await fetch(`${API}/expenses/${id}`, { method: "DELETE" });
    refresh();
  }

  const total = rows.reduce((s, r) => s + r.cost, 0);

  return (
    <>
      <form onSubmit={log} style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input required value={item} placeholder="What? (rice, bran, medicine…)"
          onChange={(e) => setItem(e.target.value)} style={{ ...input, flex: 2 }} />
        <input type="number" min="0" required value={cost} placeholder="Cost ৳"
          onChange={(e) => setCost(e.target.value)} style={{ ...input, flex: 1 }} />
        <button style={btn("#2b50aa")}>Log 💰</button>
      </form>
      <ul style={list}>
        {rows.map((r) => (
          <li key={r.id} style={card}>
            <span>{r.date} — {r.item}</span>
            <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <b>৳{r.cost}</b>
              <button onClick={() => del(r.id)} style={btn("#e04444")}>✕</button>
            </span>
          </li>
        ))}
      </ul>
      <p style={{ textAlign: "right", fontWeight: "bold" }}>All-time total: ৳{total}</p>
    </>
  );
}

function SalesPage() {
  const [rows, setRows] = useState([]);
  const [eggs, setEggs] = useState("");
  const [amount, setAmount] = useState("");

  async function refresh() {
    setRows(await (await fetch(`${API}/sales`)).json());
  }
  useEffect(() => { refresh(); }, []);

  async function log(e) {
    e.preventDefault();
    await fetch(`${API}/sales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eggs: Number(eggs), amount: Number(amount) }),
    });
    setEggs("");
    setAmount("");
    refresh();
  }

  async function del(id) {
    await fetch(`${API}/sales/${id}`, { method: "DELETE" });
    refresh();
  }

  const eggsSold = rows.reduce((s, r) => s + r.eggs, 0);
  const income = rows.reduce((s, r) => s + r.amount, 0);

  return (
    <>
      <form onSubmit={log} style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input type="number" min="0" required value={eggs} placeholder="Eggs sold 🥚"
          onChange={(e) => setEggs(e.target.value)} style={{ ...input, flex: 1 }} />
        <input type="number" min="0" required value={amount} placeholder="Amount ৳"
          onChange={(e) => setAmount(e.target.value)} style={{ ...input, flex: 1 }} />
        <button style={btn("#2b50aa")}>Log 💵</button>
      </form>
      <ul style={list}>
        {rows.map((r) => (
          <li key={r.id} style={card}>
            <span>{r.date} — <b>{r.eggs}</b> eggs</span>
            <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <b>৳{r.amount}</b>
              <button onClick={() => del(r.id)} style={btn("#e04444")}>✕</button>
            </span>
          </li>
        ))}
      </ul>
      <p style={{ textAlign: "right", fontWeight: "bold" }}>
        Sold: {eggsSold} eggs · Income: ৳{income}
      </p>
    </>
  );
}

function StatsPage() {
  const [s, setS] = useState(null);

  useEffect(() => {
    fetch(`${API}/stats`).then((r) => r.json()).then(setS);
  }, []);

  if (!s) return <p>Crunching the numbers… 🧮</p>;

  const cards = [
    ["🥚 Eggs today", s.eggsToday],
    ["📈 7-day average", `${s.avg7}/day`],
    ["🦆 Lay rate", `${s.layRate}%`],
    ["🐣 Layers now", s.layers],
    ["🌱 Upcoming ducks", s.upcoming],
    ["💵 Income (month)", `৳${s.incomeMonth}`],
    ["💰 Spend (month)", `৳${s.spendMonth}`],
    ["🧺 Eggs sold (month)", s.eggsSoldMonth ?? "—"],
  ];

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {cards.map(([label, value]) => (
          <div key={label} style={{ ...card, flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
            <span style={{ color: "#666", fontSize: 14 }}>{label}</span>
            <b style={{ fontSize: 22 }}>{value}</b>
          </div>
        ))}
      </div>

      <div style={{ ...card, marginTop: 12, flexDirection: "column", gap: 6, textAlign: "center", justifyContent: "center", background: s.profitMonth >= 0 ? "#e8f7ee" : "#fdecec" }}>
        <span style={{ color: "#666" }}>🏆 THIS MONTH'S PROFIT</span>
        <b style={{ fontSize: 30, color: s.profitMonth >= 0 ? "#16a34a" : "#e04444" }}>
          ৳{s.profitMonth}
        </b>
      </div>
    </>
  );
}

export default function App() {
  const [tab, setTab] = useState("eggs");

  return (
    <main style={{ maxWidth: 640, margin: "40px auto", fontFamily: "sans-serif", padding: 20 }}>
      <h1>🦆 QuackTrack</h1>

      <nav style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <button onClick={() => setTab("eggs")} style={btn(tab === "eggs" ? "#2b50aa" : "#bbb")}>🥚 Eggs</button>
        <button onClick={() => setTab("expenses")} style={btn(tab === "expenses" ? "#2b50aa" : "#bbb")}>💰 Expenses</button>
        <button onClick={() => setTab("sales")} style={btn(tab === "sales" ? "#2b50aa" : "#bbb")}>💵 Sales</button>
        <button onClick={() => setTab("stats")} style={btn(tab === "stats" ? "#2b50aa" : "#bbb")}>📊 Stats</button>
      </nav>

      {tab === "eggs" && <EggsPage />}
      {tab === "expenses" && <ExpensesPage />}
      {tab === "sales" && <SalesPage />}
      {tab === "stats" && <StatsPage />}
    </main>
  );
}
