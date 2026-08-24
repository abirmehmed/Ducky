import { useState, useEffect } from "react";

const API = "http://localhost:4001/api";

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
      <form className="form" onSubmit={log}>
        <input className="input" type="number" min="0" required value={count}
          placeholder="How many eggs today?" onChange={(e) => setCount(e.target.value)} />
        <button className="btn primary">Log 🥚</button>
      </form>
      <ul className="rows">
        {rows.map((r) => (
          <li key={r.id} className="row">
            <span>{r.date}: <b>{r.count}</b> eggs</span>
            <button className="btn danger" onClick={() => del(r.id)}>✕</button>
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
      <form className="form" onSubmit={log}>
        <input className="input" required value={item} placeholder="What? (rice, bran, medicine…)"
          onChange={(e) => setItem(e.target.value)} style={{ flex: 2 }} />
        <input className="input" type="number" min="0" required value={cost} placeholder="Cost ৳"
          onChange={(e) => setCost(e.target.value)} />
        <button className="btn primary">Log 💰</button>
      </form>
      <ul className="rows">
        {rows.map((r) => (
          <li key={r.id} className="row">
            <span>{r.date} — {r.item}</span>
            <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <b>৳{r.cost}</b>
              <button className="btn danger" onClick={() => del(r.id)}>✕</button>
            </span>
          </li>
        ))}
      </ul>
      <p className="total">All-time total: ৳{total}</p>
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
      <form className="form" onSubmit={log}>
        <input className="input" type="number" min="0" required value={eggs} placeholder="Eggs sold 🥚"
          onChange={(e) => setEggs(e.target.value)} />
        <input className="input" type="number" min="0" required value={amount} placeholder="Amount ৳"
          onChange={(e) => setAmount(e.target.value)} />
        <button className="btn primary">Log 💵</button>
      </form>
      <ul className="rows">
        {rows.map((r) => (
          <li key={r.id} className="row">
            <span>{r.date} — <b>{r.eggs}</b> eggs</span>
            <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <b>৳{r.amount}</b>
              <button className="btn danger" onClick={() => del(r.id)}>✕</button>
            </span>
          </li>
        ))}
      </ul>
      <p className="total">Sold: {eggsSold} eggs · Income: ৳{income}</p>
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
    ["🥚", "Eggs today", s.eggsToday],
    ["📈", "7-day average", `${s.avg7}/day`],
    ["🦆", "Lay rate", `${s.layRate}%`],
    ["🐣", "Layers now", s.layers],
    ["🌱", "Upcoming ducks", s.upcoming],
    ["💵", "Income (month)", `৳${s.incomeMonth}`],
    ["💰", "Spend (month)", `৳${s.spendMonth}`],
    ["🧺", "Eggs sold (month)", s.eggsSoldMonth ?? "—"],
  ];

  return (
    <>
      <div className="grid">
        {cards.map(([icon, label, value]) => (
          <div className="stat" key={label}>
            <span className="icon">{icon}</span>
            <span className="label">{label}</span>
            <b className="value">{value}</b>
          </div>
        ))}
      </div>

      <div className={s.profitMonth >= 0 ? "profit up" : "profit down"}>
        <span className="label">🏆 THIS MONTH'S PROFIT</span>
        <b className="big">৳{s.profitMonth}</b>
      </div>
    </>
  );
}

export default function App() {
  const [tab, setTab] = useState("eggs");

  return (
    <main className="page">
      <header className="head">
        <h1>🦆 QuackTrack</h1>
        <p className="tag">Khaki Campbell command center · 34 layers + 11 rising</p>
      </header>

      <nav className="tabs">
        <button className={tab === "eggs" ? "tab active" : "tab"} onClick={() => setTab("eggs")}>🥚 Eggs</button>
        <button className={tab === "expenses" ? "tab active" : "tab"} onClick={() => setTab("expenses")}>💰 Expenses</button>
        <button className={tab === "sales" ? "tab active" : "tab"} onClick={() => setTab("sales")}>💵 Sales</button>
        <button className={tab === "stats" ? "tab active" : "tab"} onClick={() => setTab("stats")}>📊 Stats</button>
      </nav>

      {tab === "eggs" && <EggsPage />}
      {tab === "expenses" && <ExpensesPage />}
      {tab === "sales" && <SalesPage />}
      {tab === "stats" && <StatsPage />}
    </main>
  );
}
