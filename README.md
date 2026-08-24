# 🦆 QuackTrack Dashboard

A farm management dashboard for my Khaki Campbell ducks.
Tracks eggs, expenses, sales, and live stats (lay rate, profit).

- **Frontend:** React + Vite
- **Backend:** Express (JSON file storage)

## Features
- 🥚 **Eggs** — log daily egg counts
- 💰 **Expenses** — track feed, medicine, supplies
- 💵 **Sales** — log eggs sold and income
- 📊 **Stats** — eggs today, 7-day average, lay rate %, monthly profit

## How to start

This dashboard needs the duck-api backend running.

### 1. Start the kitchen (duck-api)
~~~bash
cd duck-api
npm install
node server.js
~~~

### 2. Start the cockpit (dashboard)
~~~bash
cd duck-dashboard
npm install
npm run dev
~~~

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Backend repo:** [Ducky-Api](https://github.com/abirmehmed/Ducky-Api)
