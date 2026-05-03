'use strict';

// ============================================================
// 1. MOCK DATA — IoT / SCADA / Billing simulation
// ============================================================

const MOCK_DATA = {
  // Live sensor baseline values
  sensors: {
    power:    { value: 842.3,  min: 780,  max: 920,  unit: 'kW',    nominal: [800, 900] },
    voltage:  { value: 399.2,  min: 395,  max: 405,  unit: 'V',     nominal: [396, 402] },
    current:  { value: 1218,   min: 1100, max: 1350, unit: 'A',     nominal: [1050, 1200] },
    pf:       { value: 0.74,   min: 0.70, max: 0.82, unit: 'cos φ', nominal: [0.85, 1.0] },
    freq:     { value: 49.98,  min: 49.8, max: 50.2, unit: 'Hz',    nominal: [49.9, 50.1] },
    gas:      { value: 142.6,  min: 120,  max: 180,  unit: 'Nm³/h', nominal: [130, 165] },
    temp:     { value: 12.8,   min: 6,    max: 16,   unit: '°C',    nominal: [6, 12] },
    pressure: { value: 7.9,    min: 6.5,  max: 8.5,  unit: 'bar',   nominal: [6.8, 7.8] },
  },

  // Financial data (monthly, TND)
  financial: {
    total:       248600,
    electricity: 154100,
    gas:          77050,
    water:        17450,
    cost_kwh:      0.183,
    cost_unit:     1.24,
  },

  // 24h time-series (hourly)
  timeseries: {
    labels: Array.from({length: 24}, (_, i) => `${String(i).padStart(2,'0')}:00`),
    energy:  [62,58,54,52,56,68,82,91,105,112,118,124,121,116,119,122,115,108,102,98,94,88,78,70],
    temp_chiller: [8.2,8.0,7.8,7.6,7.9,8.5,9.1,9.8,10.4,11.2,11.9,12.6,12.8,12.5,12.3,12.7,12.4,11.8,11.2,10.6,10.0,9.4,8.9,8.5],
    temp_process: [22,21,21,20,21,23,26,28,31,33,35,37,38,37,36,37,36,35,33,31,29,27,25,23],
    current: [980,950,920,910,940,1050,1140,1200,1280,1320,1350,1380,1370,1340,1360,1380,1340,1290,1240,1200,1160,1110,1060,1010],
    gas:     [98,92,88,84,90,108,128,142,158,165,172,178,175,168,172,176,168,155,148,140,132,124,116,108],
  },

  // Monthly data (last 6 months)
  monthly: {
    labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    consumption: [182400, 198200, 204600, 196800, 231000, 218400],
    cost:         [33400,  36300,  37400,  36100,  42300,  39900],
  },

  // Audit: loss sources (%)
  loss_sources: {
    labels: ['Compressor Losses', 'Cooling Inefficiency', 'Boiler Heat Loss', 'Idle Machines', 'Electrical Losses', 'Distribution Loss'],
    values: [38, 22, 17, 11, 8, 4],
    colors: ['#FF5A5F', '#F7B731', '#FF8C42', '#A8A49C', '#5B9BFF', '#4ECDC4'],
  },

  // Alarms
  alarms: [
    { code: 'OVERFLOW_TEMP_HIGH',    sev: 'critical', system: 'Cooling',    ts: '-2 min',  impact: '87 TND/hr' },
    { code: 'POWER_FACTOR_LOW',      sev: 'critical', system: 'Electrical', ts: '-8 min',  impact: '120 TND/hr' },
    { code: 'COMPRESSOR_OVERPRESS',  sev: 'warning',  system: 'Air System', ts: '-15 min', impact: '42 TND/hr' },
    { code: 'CHILLER_FAULT_C2',      sev: 'critical', system: 'Cooling',    ts: '-23 min', impact: '65 TND/hr' },
    { code: 'STEAM_PRESSURE_DROP',   sev: 'warning',  system: 'Steam',      ts: '-31 min', impact: '28 TND/hr' },
  ],

  // Virtual sensors
  virtual: [
    { name: 'Equipment Efficiency',     value: 68.4, unit: '%',  status: 'warn',   desc: 'Below nominal (85%). Compressor & chiller degrading efficiency.' },
    { name: 'Compressor Efficiency',    value: 61.2, unit: '%',  status: 'danger', desc: 'Critical: 39% energy wasted in compression. Leaks suspected.' },
    { name: 'Cooling Performance (COP)',value: 2.1,  unit: 'COP',status: 'warn',   desc: 'Design COP = 3.5. Fouled heat exchangers likely culprit.' },
    { name: 'Machine Health Score',     value: 72.0, unit: '%',  status: 'warn',   desc: 'Composite score across vibration, temp, current signature.' },
    { name: 'Energy Loss Index',        value: 331.8,unit: 'kWh',status: 'danger', desc: 'Real-time estimated energy wasted vs thermodynamic optimum.' },
  ],

  // AI Recommendations (engineer)
  recs_eng: [
    { icon: '🌡️', text: '<strong>Chiller efficiency dropping</strong> — COP at 2.1 vs design 3.5. Schedule heat exchanger cleaning within 48h.' },
    { icon: '⚡', text: '<strong>Power factor 0.74 is below 0.85 threshold</strong> — STEG penalty risk applies at billing cycle end. Install capacitor bank.' },
    { icon: '💨', text: '<strong>Possible air leak in compressed air system</strong> — Pressure drop exceeds expected model by 0.3 bar. Inspect Zone B-4 joints.' },
    { icon: '🔧', text: '<strong>Compressor 2 running above rated pressure</strong> — Reduce setpoint from 7.9 to 7.2 bar for 10% energy saving.' },
    { icon: '📊', text: '<strong>Steam consumption spike at 02:00–04:00</strong> — Nighttime usage anomaly detected. Verify sterilisation schedule.' },
  ],

  // Business alerts (translated)
  biz_alerts: [
    { sev: 'danger', issue: 'Chiller Overheating → Energy Cost Spike',         impact: '+15% electricity cost — running hot = running expensive',        cost: '≈ +23,100 TND/month extra' },
    { sev: 'danger', issue: 'Low Power Factor → STEG Penalty Imminent',        impact: 'cos φ = 0.74 triggers contractual reactive power penalties',      cost: '≈ 18,400 TND penalty at billing' },
    { sev: 'danger', issue: 'Compressed Air Leaks → Direct Cash Drain',        impact: '39% of compressor output wasted — you are paying to pressurize air that escapes', cost: '≈ 8,000 TND/month wasted' },
    { sev: 'warn',   issue: 'Idle Machines Drawing Standby Power',             impact: 'Production line C offline but consuming 42 kW in standby mode',   cost: '≈ 3,600 TND/month' },
    { sev: 'warn',   issue: 'Night Consumption Anomaly',                       impact: 'Energy use at 02:00–04:00 should be near zero per production plan', cost: '≈ 2,200 TND/month unexplained' },
  ],

  // Actionable recommendations
  actions: [
    { text: 'Reduce compressor network pressure from 7.9 bar → 7.2 bar', savings: 'Save 10% energy → 7,700 TND/month' },
    { text: 'Fix compressed air leaks in Zone B-4 (estimated 4 leak points)', savings: 'Save 8,000 TND/month' },
    { text: 'Install reactive power compensation (capacitor bank 400 kvar)', savings: 'Avoid STEG penalty → 18,400 TND/billing period' },
    { text: 'Activate heat recovery from tri-gen exhaust to pre-heat process water', savings: 'Save ≈ 5,200 TND/month' },
    { text: 'Schedule chiller heat exchanger cleaning (C1 & C2)', savings: 'Restore COP to 3.0 → reduce cooling energy 28%' },
    { text: 'Implement automatic machine shutdown after 15 min idle', savings: 'Save 3,600 TND/month standby waste' },
  ],

  // Business metrics
  biz_metrics: [
    { label: 'Efficiency Index',     value: '68.4%', num: 68.4, status: 'warn',   desc: 'Ratio of useful output energy vs total consumed' },
    { label: 'Waste Cost Ratio',     value: '39.4%', num: 39.4, status: 'danger', desc: 'Fraction of total energy spend that produces no value' },
    { label: 'Energy Intensity',     value: '2.14',  num: 68,   status: 'warn',   desc: 'kWh consumed per production unit (target: 1.8 kWh/unit)' },
  ],

  // Forecasts
  predictions: [
    { label: 'Next Month Cost (forecast)',  val: '262,400 TND', status: 'danger', badge: '↑ +5.6%' },
    { label: 'Peak Demand Prediction',      val: '938 kW',      status: 'warn',   badge: '⚠ OVERAGE' },
    { label: 'Penalty Risk (STEG)',         val: 'HIGH',         status: 'danger', badge: '🔴 ACT NOW' },
    { label: 'Break-even fix ROI',          val: '< 3 months',   status: 'warn',   badge: 'PAYBACK' },
  ],

  // Forecast chart (next 6 months projected vs optimized)
  forecast_chart: {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    projected:  [262400, 271000, 285000, 280000, 268000, 255000],
    optimized:  [218000, 210000, 208000, 205000, 200000, 196000],
  },
};

// ============================================================
// 2. CHART REGISTRY — keep references to update/destroy
// ============================================================
const CHARTS = {};

// ============================================================
// 3. HELPERS
// ============================================================

/** Compute jittered sensor value for live simulation */
function jitter(base, amplitude) {
  return base + (Math.random() - 0.5) * amplitude;
}

/** Map a value to [0,100] range given a min/max */
function toPercent(val, min, max) {
  return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
}

/** Determine status class based on nominal range */
function sensorStatus(val, nominal) {
  if (val < nominal[0] || val > nominal[1]) return 'danger';
  const mid = (nominal[0] + nominal[1]) / 2;
  const dist = Math.abs(val - mid) / (nominal[1] - nominal[0]);
  return dist > 0.35 ? 'warn' : 'ok';
}

/** Format number with commas */
function fmt(n, decimals = 0) {
  return Number(n).toLocaleString('en', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

/** Create a Chart.js chart */
function makeChart(id, type, data, options = {}) {
  const ctx = document.getElementById(id);
  if (!ctx) return null;
  if (CHARTS[id]) CHARTS[id].destroy();
  const defaults = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: '#4A5568',
          font: { family: "'DM Mono', monospace", size: 11 },
          boxWidth: 12,
        }
      },
      tooltip: {
        backgroundColor: '#0D1B3E',
        borderColor: '#B8965A',
        borderWidth: 1,
        titleColor: '#D4AF74',
        bodyColor: '#C8C3BA',
        titleFont: { family: "'DM Mono', monospace" },
        bodyFont: { family: "'DM Sans', sans-serif" },
      }
    },
    scales: {
      x: {
        ticks: { color: '#8A92A0', font: { family: "'DM Mono', monospace", size: 10 } },
        grid: { color: 'rgba(200,195,186,0.5)' },
      },
      y: {
        ticks: { color: '#8A92A0', font: { family: "'DM Mono', monospace", size: 10 } },
        grid: { color: 'rgba(200,195,186,0.5)' },
      }
    }
  };
  CHARTS[id] = new Chart(ctx, { type, data, options: deepMerge(defaults, options) });
  return CHARTS[id];
}

/** Deep merge two objects */
function deepMerge(target, source) {
  const out = Object.assign({}, target);
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      out[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}

// ============================================================
// 4. CLOCK
// ============================================================
function startClock() {
  function tick() {
    const now = new Date();
    const timeEl = document.getElementById('time-display');
    const dateEl = document.getElementById('date-display');
    const updateEl = document.getElementById('last-update');
    if (timeEl) timeEl.textContent = now.toLocaleTimeString('en', { hour12: false });
    if (dateEl) dateEl.textContent = now.toLocaleDateString('en', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    if (updateEl) updateEl.textContent = now.toLocaleTimeString('en', { hour12: false });
  }
  tick();
  setInterval(tick, 1000);
}

// ============================================================
// 5. KPI UPDATER — simulates live data
// ============================================================
function updateKPIs() {
  const S = MOCK_DATA.sensors;

  // Generate live values
  const live = {
    power:    jitter(S.power.value, 18),
    voltage:  jitter(S.voltage.value, 1.5),
    current:  jitter(S.current.value, 40),
    pf:       Math.max(0.68, Math.min