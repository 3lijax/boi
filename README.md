# Tradingpool Pro - Quantitative Deriv Synthetic Analytics Suite

A lightweight, zero-dependency, ultra-modern client-side analytics suite for **Deriv Synthetic Volatility Indices** (Continuous Volatility, Boom/Crash, Step, and Jump Indices).

Built as a clean, transparent, and mathematically rigorous alternative to black-box digit predictors.

---

## 🌟 Key Features

1. **Direct Deriv WebSocket Integration (`wss://ws.derivws.com/websockets/v3`)**:
   - Live stream subscription with automatic backfilling of up to **1,000 historical ticks**.
   - Auto-reconnect with exponential backoff on network interruptions.
   - Comprehensive asset selection across Continuous Volatility (10, 25, 50, 75, 100, 150, 250), Boom/Crash, Step, and Jump indices.

2. **Genuine Quantitative Models (No Artificial/Faked Random Numbers)**:
   - **Shannon Entropy Analysis**: Measures the degree of randomness/disorder in digit distribution against the theoretical maximum ($H_{\max} = \log_2(10) \approx 3.3219$ bits).
   - **Empirical Digit Matrix (0 - 9)**: Real-time frequency tracker highlighting statistical outliers with automatic **HOT** ($\ge 12\%$) and **COLD** ($\le 8\%$) designation.
   - **Even / Odd Parity Analysis**: Evaluates parity distribution, recent bias over 20-30 tick rolling windows, and active streak lengths.
   - **Over / Under Barrier Modeling**: Empirical distribution modeling against user-selected digit barriers (0 through 9).
   - **Matches / Differs Clustering**: Identifies mode digits exceeding standard uniform expectation ($10\%$).
   - **Rise / Fall & Momentum**: Trend direction calculation over rolling tick windows.
   - **Markov Transition Matrix**: 10x10 empirical state transition likelihood table predicting subsequent digit probability ($P(D_t \mid D_{t-1})$).

3. **Paper Trading & Virtual Simulator Suite**:
   - **Simulated Capital & Wallet**: Start with $10,000.00 virtual equity with live PnL, Win Rate %, Profit Factor, and streak tracking.
   - **Dual Execution Modes**:
     - **Manual Order Pad**: Quick betting on Even/Odd, Over/Under, Matches/Differs, Rise/Fall, and 1-click execution of the live strategy recommendation.
     - **Automated Bot Trader**: Autonomous execution engine triggered when strategy confidence meets or exceeds configurable thresholds (e.g., 65%–95%).
   - **Money Management & Staking Systems**: Flat stake, Martingale progression (2.0x on loss), or D'Alembert (+1 unit on loss, -1 on win).
   - **Safety Circuit Breakers**: Configurable Take Profit ($) and Stop Loss ($) targets, plus maximum consecutive loss cutoff.
   - **Live Active Orders Monitor**: Tick-by-tick settlement countdown with progress rings and dual-tone audio signals.
   - **Equity Growth Curve**: Dynamic line chart tracking portfolio balance after every trade.
   - **Trade Ledger & CSV Export**: Complete historical audit log with filtering and instant CSV export.

4. **High-Performance Visuals**:
   - Real-time animated **Chart.js** price visualization with strategy-aware conditional point coloring (Cyan = Over, Red = Under, Blue/Amber = Even/Odd, Green = Match).
   - Ultra-modern dark glassmorphic UI styled for high-frequency monitoring across both desktop and mobile screens.

---

## 🚀 How to Run

Because the project is built using modern ES6 modules and WebSockets, you can launch it with any local static web server or open it directly in a modern browser.

### Option 1: Using Python
```bash
python -m http.server 8080
```
Then navigate to: `http://localhost:8080/dashboard.html`

### Option 2: Using Node.js (`npx serve`)
```bash
npx serve .
```

### Option 3: Direct File Open
You can also open `index.html` or `dashboard.html` directly in Google Chrome, Microsoft Edge, or Firefox.

---

## 📂 Project Structure

```text
├── index.html       # Clean portal and feature overview page
├── dashboard.html   # Main quantitative analytics dashboard and live charts
├── style.css        # Responsive dark glassmorphism stylesheet
├── app.js           # Deriv WebSocket client, Chart.js engine & statistical algorithms
└── README.md        # Technical documentation
```

"# boi" 
