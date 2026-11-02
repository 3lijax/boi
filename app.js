/**
 * Tradingpool Pro - Quantitative Deriv Synthetic Analytics Suite
 * Full-Featured Re-Architecture:
 * - Real-time WebSocket streaming with 1,000 tick backfill
 * - Strategy-aware conditional chart point rendering
 * - Markov chain digit transition probability matrix
 * - Dynamic 20-digit chronological ticker ribbon & streak detection
 * - Web Audio API synthesized alerts
 * - Sample window filtering (50, 100, 500, 1000 ticks)
 * - CSV history export & Deriv WebTrader deep-link bridge
 * - Shannon Entropy & true empirical confidence calculation
 */

// --- Global Configuration ---
import { initLanguage, setLanguage, activeLanguage, t, SUPPORTED_LANGUAGES } from './i18n.js';

// --- Multi-Theme Engine ---
export const SUPPORTED_THEMES = [
    { id: 'midnight', name: 'Midnight Pro', color: '#3b82f6' },
    { id: 'emerald', name: 'Matrix Emerald', color: '#10b981' },
    { id: 'crimson', name: 'Obsidian Tokyo', color: '#ec4899' },
    { id: 'light', name: 'Solar Light', color: '#2563eb' }
];

export let activeTheme = 'midnight';

export function setTheme(themeName) {
    const valid = SUPPORTED_THEMES.find(t => t.id === themeName);
    if (!valid) themeName = 'midnight';
    activeTheme = themeName;

    try {
        localStorage.setItem('tradingpool_theme', themeName);
    } catch (e) {}

    const applyThemeDOM = () => {
        if (typeof document !== 'undefined') {
            document.body.dataset.theme = themeName;

            const themeSelect = document.getElementById('theme-select');
            if (themeSelect) themeSelect.value = themeName;

            const label = document.getElementById('current-theme-label');
            if (label) {
                const current = SUPPORTED_THEMES.find(t => t.id === themeName) || SUPPORTED_THEMES[0];
                label.innerText = current.name.split(' ')[0];
            }

            document.querySelectorAll('.theme-opt-btn').forEach(btn => {
                if (btn.dataset.theme === themeName) btn.classList.add('active');
                else btn.classList.remove('active');
            });

            updateChartsTheme(themeName);
        }
    };

    // Modern View Transitions API for seamless cross-theme morphing
    if (typeof document !== 'undefined' && document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.startViewTransition(() => applyThemeDOM());
    } else {
        applyThemeDOM();
    }

    return activeTheme;
}

export function initTheme() {
    let saved = 'midnight';
    try {
        saved = localStorage.getItem('tradingpool_theme') || 'midnight';
    } catch (e) {}
    setTheme(saved);
}

export function getThemeColors(themeName) {
    const theme = themeName || (typeof document !== 'undefined' && document.body.getAttribute('data-theme')) || 'midnight';
    switch (theme) {
        case 'emerald':
            return {
                primary: '#10b981',
                primaryHover: '#059669',
                primaryLight: '#34d399',
                chartBorder: '#10b981',
                chartFillStart: 'rgba(16, 185, 129, 0.35)',
                chartFillEnd: 'rgba(16, 185, 129, 0.0)',
                gridColor: 'rgba(16, 185, 129, 0.08)',
                tickColor: '#4ade80',
                equityGrid: 'rgba(16, 185, 129, 0.06)',
                tooltipBg: 'rgba(8, 24, 17, 0.95)',
                tooltipText: '#f0fdf4',
                pointBorder: '#040e09'
            };
        case 'crimson':
            return {
                primary: '#ec4899',
                primaryHover: '#db2777',
                primaryLight: '#f472b6',
                chartBorder: '#ec4899',
                chartFillStart: 'rgba(236, 72, 153, 0.35)',
                chartFillEnd: 'rgba(236, 72, 153, 0.0)',
                gridColor: 'rgba(236, 72, 153, 0.08)',
                tickColor: '#f472b6',
                equityGrid: 'rgba(236, 72, 153, 0.06)',
                tooltipBg: 'rgba(24, 14, 26, 0.95)',
                tooltipText: '#fdf2f8',
                pointBorder: '#0f0810'
            };
        case 'light':
            return {
                primary: '#2563eb',
                primaryHover: '#1d4ed8',
                primaryLight: '#3b82f6',
                chartBorder: '#2563eb',
                chartFillStart: 'rgba(37, 99, 235, 0.25)',
                chartFillEnd: 'rgba(37, 99, 235, 0.0)',
                gridColor: 'rgba(0, 0, 0, 0.08)',
                tickColor: '#475569',
                equityGrid: 'rgba(0, 0, 0, 0.06)',
                tooltipBg: 'rgba(255, 255, 255, 0.98)',
                tooltipText: '#0f172a',
                pointBorder: '#ffffff'
            };
        case 'midnight':
        default:
            return {
                primary: '#3b82f6',
                primaryHover: '#2563eb',
                primaryLight: '#60a5fa',
                chartBorder: '#3b82f6',
                chartFillStart: 'rgba(59, 130, 246, 0.35)',
                chartFillEnd: 'rgba(59, 130, 246, 0.0)',
                gridColor: 'rgba(255, 255, 255, 0.05)',
                tickColor: '#64748b',
                equityGrid: 'rgba(255, 255, 255, 0.04)',
                tooltipBg: 'rgba(15, 23, 42, 0.95)',
                tooltipText: '#f8fafc',
                pointBorder: '#07090e'
            };
    }
}

export function updateChartsTheme(themeName) {
    if (typeof document === 'undefined') return;
    if (typeof Chart === 'undefined') return;

    const colors = getThemeColors(themeName);

    if (AppState.chart) {
        const canvas = document.getElementById('tickChart');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            const gradient = ctx.createLinearGradient(0, 0, 0, 260);
            gradient.addColorStop(0, colors.chartFillStart);
            gradient.addColorStop(1, colors.chartFillEnd);
            AppState.chart.data.datasets[0].backgroundColor = gradient;
        }
        AppState.chart.data.datasets[0].borderColor = colors.chartBorder;
        AppState.chart.data.datasets[0].pointBorderColor = colors.pointBorder;
        if (AppState.chart.options.scales && AppState.chart.options.scales.y) {
            AppState.chart.options.scales.y.grid.color = colors.gridColor;
            AppState.chart.options.scales.y.ticks.color = colors.tickColor;
        }
        if (AppState.chart.options.plugins && AppState.chart.options.plugins.tooltip) {
            AppState.chart.options.plugins.tooltip.backgroundColor = colors.tooltipBg;
            AppState.chart.options.plugins.tooltip.titleColor = colors.tickColor;
            AppState.chart.options.plugins.tooltip.bodyColor = colors.tooltipText;
        }
        AppState.chart.update('none');
    }

    if (PaperTradingState.equityChart) {
        PaperTradingState.equityChart.data.datasets[0].pointBorderColor = colors.pointBorder;
        if (PaperTradingState.equityChart.options.scales && PaperTradingState.equityChart.options.scales.y) {
            PaperTradingState.equityChart.options.scales.y.grid.color = colors.equityGrid;
            PaperTradingState.equityChart.options.scales.y.ticks.color = colors.tickColor;
        }
        if (PaperTradingState.equityChart.options.scales && PaperTradingState.equityChart.options.scales.x) {
            PaperTradingState.equityChart.options.scales.x.ticks.color = colors.tickColor;
        }
        if (PaperTradingState.equityChart.options.plugins && PaperTradingState.equityChart.options.plugins.tooltip) {
            PaperTradingState.equityChart.options.plugins.tooltip.backgroundColor = colors.tooltipBg;
            PaperTradingState.equityChart.options.plugins.tooltip.titleColor = colors.tickColor;
            PaperTradingState.equityChart.options.plugins.tooltip.bodyColor = colors.tooltipText;
        }
        PaperTradingState.equityChart.update('none');
    }

    if (BacktestState && BacktestState.chart) {
        if (BacktestState.chart.options.scales && BacktestState.chart.options.scales.y) {
            BacktestState.chart.options.scales.y.grid.color = colors.gridColor;
            BacktestState.chart.options.scales.y.ticks.color = colors.tickColor;
        }
        if (BacktestState.chart.options.scales && BacktestState.chart.options.scales.x) {
            BacktestState.chart.options.scales.x.ticks.color = colors.tickColor;
        }
        if (BacktestState.chart.options.plugins && BacktestState.chart.options.plugins.tooltip) {
            BacktestState.chart.options.plugins.tooltip.backgroundColor = colors.tooltipBg;
            BacktestState.chart.options.plugins.tooltip.titleColor = colors.tickColor;
            BacktestState.chart.options.plugins.tooltip.bodyColor = colors.tooltipText;
        }
        BacktestState.chart.update('none');
    }
}

const CONFIG = {
    appId: '1089', // Official public Deriv Demo API App ID
    wsUrl: 'wss://ws.derivws.com/websockets/v3',
    maxChartTicks: 50,
    maxBuffer: 1000,
    reconnect: {
        initialDelay: 1000,
        maxDelay: 20000,
        factor: 1.5
    }
};

// --- Comprehensive Deriv Synthetic Assets Catalog ---
export const MARKET_ASSETS = [
    {
        category: 'Continuous Volatility (1s)',
        items: [
            { name: 'Volatility 10 (1s)', symbol: '1HZ10V' },
            { name: 'Volatility 25 (1s)', symbol: '1HZ25V' },
            { name: 'Volatility 50 (1s)', symbol: '1HZ50V' },
            { name: 'Volatility 75 (1s)', symbol: '1HZ75V' },
            { name: 'Volatility 100 (1s)', symbol: '1HZ100V' },
            { name: 'Volatility 150 (1s)', symbol: '1HZ150V' },
            { name: 'Volatility 250 (1s)', symbol: '1HZ250V' }
        ]
    },
    {
        category: 'Continuous Volatility (Standard)',
        items: [
            { name: 'Volatility 10 Index', symbol: 'R_10' },
            { name: 'Volatility 25 Index', symbol: 'R_25' },
            { name: 'Volatility 50 Index', symbol: 'R_50' },
            { name: 'Volatility 75 Index', symbol: 'R_75' },
            { name: 'Volatility 100 Index', symbol: 'R_100' }
        ]
    },
    {
        category: 'Boom & Crash Indices',
        items: [
            { name: 'Boom 300 Index', symbol: 'BOOM300' },
            { name: 'Boom 500 Index', symbol: 'BOOM500' },
            { name: 'Boom 1000 Index', symbol: 'BOOM1000' },
            { name: 'Crash 300 Index', symbol: 'CRASH300' },
            { name: 'Crash 500 Index', symbol: 'CRASH500' },
            { name: 'Crash 1000 Index', symbol: 'CRASH1000' }
        ]
    },
    {
        category: 'Step & Jump Indices',
        items: [
            { name: 'Step Index', symbol: 'STEP' },
            { name: 'Step 10 Index', symbol: 'STEP10' },
            { name: 'Step 25 Index', symbol: 'STEP25' },
            { name: 'Jump 10 Index', symbol: 'JUMP_10' },
            { name: 'Jump 50 Index', symbol: 'JUMP_50' },
            { name: 'Jump 100 Index', symbol: 'JUMP_100' }
        ]
    }
];

// --- Application State ---
export const AppState = {
    isAnalyzing: false,
    startTime: null,
    timerInterval: null,
    currentSymbol: '1HZ10V',
    ticks: [], // { price: number, digit: number, time: number }
    totalProcessed: 0,
    feedManager: null,
    chart: null,
    activeStrategy: 'even_odd',
    barrier: 5,
    sampleWindow: 1000,
    soundEnabled: true,
    audioCtx: null,
    // 10x10 Markov Transition Matrix: transitions[from][to] = count
    transitions: Array.from({ length: 10 }, () => Array(10).fill(0))
};

// --- Web Audio API Chime Synthesizer ---
function playSignalChime(frequency = 587.33, type = 'sine') {
    if (!AppState.soundEnabled) return;
    try {
        if (!AppState.audioCtx) {
            AppState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (AppState.audioCtx.state === 'suspended') {
            AppState.audioCtx.resume();
        }
        const osc = AppState.audioCtx.createOscillator();
        const gain = AppState.audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, AppState.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, AppState.audioCtx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.12, AppState.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, AppState.audioCtx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(AppState.audioCtx.destination);
        osc.start();
        osc.stop(AppState.audioCtx.currentTime + 0.36);
    } catch (e) {
        // Audio policy or unsupported
    }
}

function playWinChime() {
    if (!AppState.soundEnabled) return;
    try {
        if (!AppState.audioCtx) AppState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (AppState.audioCtx.state === 'suspended') AppState.audioCtx.resume();
        const now = AppState.audioCtx.currentTime;

        const osc1 = AppState.audioCtx.createOscillator();
        const osc2 = AppState.audioCtx.createOscillator();
        const gain = AppState.audioCtx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, now);
        osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.1);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(659.25, now + 0.1);
        osc2.frequency.exponentialRampToValueAtTime(783.99, now + 0.22);

        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(AppState.audioCtx.destination);

        osc1.start(now);
        osc1.stop(now + 0.15);
        osc2.start(now + 0.1);
        osc2.stop(now + 0.45);
    } catch (e) {}
}

function playLossTone() {
    if (!AppState.soundEnabled) return;
    try {
        if (!AppState.audioCtx) AppState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (AppState.audioCtx.state === 'suspended') AppState.audioCtx.resume();
        const now = AppState.audioCtx.currentTime;

        const osc = AppState.audioCtx.createOscillator();
        const gain = AppState.audioCtx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(164.81, now + 0.25);

        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(AppState.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
    } catch (e) {}
}

// --- Toast Notifications ---
export function showToast(message, type = 'info') {
    if (typeof document === 'undefined') return;
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-circle-exclamation';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(30px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- Digit Extractor ---
export function extractDigit(price, pipSize = 2) {
    const formatted = Number(price).toFixed(pipSize);
    return parseInt(formatted.slice(-1), 10);
}

// --- Slice Ticks by Active Sample Window ---
function getWindowTicks() {
    if (AppState.ticks.length <= AppState.sampleWindow) {
        return AppState.ticks;
    }
    return AppState.ticks.slice(-AppState.sampleWindow);
}

// --- Mathematical and Statistical Indicators ---

/**
 * Calculates Shannon Entropy: H = -sum(p * log2(p)).
 * Ideal uniform 10-digit entropy is ~3.3219 bits. Lower values indicate clustering.
 */
export function calculateShannonEntropy(counts, total) {
    if (total <= 0) return 0;
    let entropy = 0;
    counts.forEach(c => {
        if (c > 0) {
            const p = c / total;
            entropy -= p * Math.log2(p);
        }
    });
    return entropy;
}

/**
 * Recomputes the 10x10 Markov Transition Matrix from historical ticks.
 */
function rebuildTransitionMatrix() {
    AppState.transitions = Array.from({ length: 10 }, () => Array(10).fill(0));
    const list = AppState.ticks;
    for (let i = 1; i < list.length; i++) {
        const from = list[i - 1].digit;
        const to = list[i].digit;
        if (from >= 0 && from <= 9 && to >= 0 && to <= 9) {
            AppState.transitions[from][to]++;
        }
    }
}

/**
 * Returns analysis of the digit distribution over current sample window.
 */
export function analyzeDigitDistribution(ticks) {
    const counts = Array(10).fill(0);
    ticks.forEach(t => {
        if (t.digit >= 0 && t.digit <= 9) counts[t.digit]++;
    });
    const total = ticks.length;
    const percentages = counts.map(c => total > 0 ? (c / total) * 100 : 0);

    const hotDigits = [];
    const coldDigits = [];
    percentages.forEach((pct, digit) => {
        if (total >= 50) {
            if (pct >= 12.0) hotDigits.push(digit);
            if (pct <= 8.0) coldDigits.push(digit);
        }
    });

    const maxOccurring = counts.indexOf(Math.max(...counts));
    const minOccurring = counts.indexOf(Math.min(...counts));

    return {
        counts,
        percentages,
        total,
        hotDigits,
        coldDigits,
        maxOccurring,
        minOccurring,
        entropy: calculateShannonEntropy(counts, total)
    };
}

/**
 * Real Quantitative Strategy Evaluation
 */
export function evaluateStrategyPrediction(strategy, ticks, barrier = 5) {
    if (ticks.length < 5) {
        return {
            valid: false,
            message: 'Awaiting minimum ticks for statistical convergence...'
        };
    }

    const total = ticks.length;

    switch (strategy) {
        case 'even_odd': {
            // Evaluate both macro (sample window) and micro (rolling 30 ticks for active momentum)
            const microWindow = ticks.slice(-30);
            let microEvens = 0, microOdds = 0;
            microWindow.forEach(t => t.digit % 2 === 0 ? microEvens++ : microOdds++);

            let totalEvens = 0, totalOdds = 0;
            ticks.forEach(t => t.digit % 2 === 0 ? totalEvens++ : totalOdds++);

            // Consecutive streak detection
            let streak = 0;
            const lastType = ticks[ticks.length - 1].digit % 2;
            for (let i = ticks.length - 1; i >= 0; i--) {
                if (ticks[i].digit % 2 === lastType) streak++;
                else break;
            }

            const isEvenBias = microEvens !== microOdds ? (microEvens > microOdds) : (totalEvens >= totalOdds);
            const bias = isEvenBias ? 'EVEN' : 'ODD';

            // Confidence calculation incorporates short-term momentum + streak bonus
            const microRatio = Math.max(microEvens, microOdds) / microWindow.length;
            const macroRatio = Math.max(totalEvens, totalOdds) / total;
            let streakBonus = 0;
            if (streak >= 5) streakBonus = 12;
            else if (streak >= 4) streakBonus = 8;
            else if (streak >= 3) streakBonus = 5;
            else if (streak >= 2) streakBonus = 2;

            const baseConf = (microRatio * 0.7 + macroRatio * 0.3) * 100;
            const confidence = Math.min(94, Math.max(50, Math.round(baseConf + streakBonus)));

            return {
                valid: true,
                strategy: 'Even / Odd Parity',
                outcome: bias,
                isPositive: bias === 'EVEN',
                confidence,
                analysis: `Recent 30 ticks: ${microEvens} Evens vs ${microOdds} Odds (${((Math.max(microEvens, microOdds)/microWindow.length)*100).toFixed(0)}% momentum). Active streak: ${streak} ${lastType === 0 ? 'Evens' : 'Odds'} in a row.`
            };
        }

        case 'over_under': {
            const microWindow = ticks.slice(-30);
            let microOver = 0, microUnder = 0;
            microWindow.forEach(t => {
                if (t.digit > barrier) microOver++;
                else if (t.digit < barrier) microUnder++;
            });

            let totalOver = 0, totalUnder = 0, totalExact = 0;
            ticks.forEach(t => {
                if (t.digit > barrier) totalOver++;
                else if (t.digit < barrier) totalUnder++;
                else totalExact++;
            });

            const isOver = microOver !== microUnder ? (microOver > microUnder) : (totalOver >= totalUnder);
            const outcome = isOver ? 'OVER' : 'UNDER';
            const microPct = (Math.max(microOver, microUnder) / Math.max(1, microOver + microUnder)) * 100;
            const confidence = Math.min(94, Math.max(50, Math.round(microPct * 0.75 + 15)));

            return {
                valid: true,
                strategy: 'Over / Under (Barrier)',
                outcome,
                isPositive: isOver,
                confidence,
                analysis: `Barrier = ${barrier}. Recent 30 ticks: ${microOver} Over vs ${microUnder} Under. Total sample: ${totalOver} Over, ${totalUnder} Under, ${totalExact} Exact Matches.`
            };
        }

        case 'matches': {
            const dist = analyzeDigitDistribution(ticks);
            const topDigit = dist.maxOccurring;
            const topCount = dist.counts[topDigit];
            const topPct = dist.percentages[topDigit].toFixed(1);
            const confidence = Math.min(92, Math.max(25, Math.round(parseFloat(topPct) * 4.5)));

            return {
                valid: true,
                strategy: 'Matches / Differs',
                outcome: 'MATCHES',
                target: topDigit,
                isPositive: true,
                confidence,
                analysis: `Digit ${topDigit} is the highest frequency mode with ${topCount} occurrences (${topPct}% vs 10% expected). Cluster density suggests continuation.`
            };
        }

        case 'rise_fall': {
            const windowSize = Math.min(25, ticks.length);
            const windowTicks = ticks.slice(-windowSize);
            const startPrice = windowTicks[0].price;
            const endPrice = windowTicks[windowTicks.length - 1].price;
            const isRise = endPrice >= startPrice;
            const delta = endPrice - startPrice;

            let upSteps = 0, downSteps = 0;
            for (let i = 1; i < windowTicks.length; i++) {
                if (windowTicks[i].price >= windowTicks[i - 1].price) upSteps++;
                else downSteps++;
            }
            const momentumPct = ((Math.max(upSteps, downSteps) / (windowTicks.length - 1)) * 100);
            const confidence = Math.min(92, Math.max(50, Math.round(momentumPct)));

            return {
                valid: true,
                strategy: 'Rise / Fall (Rolling Trend)',
                outcome: isRise ? 'RISE' : 'FALL',
                isPositive: isRise,
                confidence,
                analysis: `Price moved from ${startPrice.toFixed(4)} to ${endPrice.toFixed(4)} (${delta >= 0 ? '+' : ''}${delta.toFixed(4)}) across last ${windowSize} ticks. Up steps: ${upSteps}, Down steps: ${downSteps}.`
            };
        }

        case 'up_down': {
            if (ticks.length < 2) return { valid: false, message: 'Need at least 2 ticks.' };
            const last = ticks[ticks.length - 1].price;
            const prev = ticks[ticks.length - 2].price;
            const isUp = last >= prev;

            return {
                valid: true,
                strategy: 'Up / Down (Momentum)',
                outcome: isUp ? 'UP' : 'DOWN',
                isPositive: isUp,
                confidence: 65,
                analysis: `Immediate step momentum: Last quote ${last.toFixed(4)} vs prior ${prev.toFixed(4)}.`
            };
        }

        default:
            return { valid: false, message: 'Select a strategy' };
    }
}

// --- Market Feed Engine (Live Deriv WebSocket + Seamless Synthetic Generator) ---

export class SyntheticFeedProvider {
    constructor(onHistory, onTick) {
        this.onHistory = onHistory;
        this.onTick = onTick;
        this.interval = null;
        this.price = 1000;
        this.pipSize = 2;
        this.step = 0.35;
        this.intervalMs = 1000;
    }

    baselineFor(symbol) {
        // High fidelity baseline matching Deriv synthetic specifications
        if (symbol.startsWith('1HZ')) {
            const vol = parseInt(symbol.replace('1HZ', '').replace('V', ''), 10) || 10;
            const pip = (vol === 50 || vol === 75) ? 4 : 2;
            const step = (vol / 100) * 0.45;
            return { price: 500 + Math.random() * 4000, pipSize: pip, step: Math.max(0.08, step), intervalMs: 1000 };
        }
        if (symbol.startsWith('R_')) {
            const vol = parseInt(symbol.replace('R_', ''), 10) || 10;
            const pip = (vol === 50 || vol === 75) ? 4 : 2;
            const step = (vol / 100) * 0.55;
            return { price: 1000 + Math.random() * 6000, pipSize: pip, step: Math.max(0.1, step), intervalMs: 2000 };
        }
        if (symbol.startsWith('BOOM') || symbol.startsWith('CRASH')) {
            return { price: 1000 + Math.random() * 5000, pipSize: 2, step: 0.65, intervalMs: 1000 };
        }
        if (symbol.startsWith('STEP')) {
            return { price: 2000 + Math.random() * 1000, pipSize: 1, step: 0.5, intervalMs: 1000 };
        }
        if (symbol.startsWith('JUMP')) {
            return { price: 3000 + Math.random() * 5000, pipSize: 2, step: 0.45, intervalMs: 1000 };
        }
        return { price: 1000 + Math.random() * 3000, pipSize: 2, step: 0.35, intervalMs: 1000 };
    }

    start(symbol) {
        this.stop();
        const base = this.baselineFor(symbol);
        this.price = base.price;
        this.pipSize = base.pipSize;
        this.step = base.step;
        this.intervalMs = base.intervalMs;

        // 1. Generate 1,000 realistic historical ticks immediately
        const prices = [];
        const times = [];
        let p = this.price;
        const now = Math.floor(Date.now() / 1000);
        const timeStep = Math.round(this.intervalMs / 1000);

        for (let i = 0; i < 1000; i++) {
            p += (Math.random() - 0.5) * this.step;
            if (p < 1) p = 10;
            prices.push(Number(p.toFixed(this.pipSize)));
            times.push(now - (1000 - i) * timeStep);
        }
        this.price = p;

        this.onHistory({
            history: { prices, times },
            pip_size: this.pipSize
        });

        // 2. Stream ticks continuously
        this.interval = setInterval(() => {
            let delta = (Math.random() - 0.5) * this.step;
            if (symbol.startsWith('BOOM') && Math.random() < 0.02) {
                delta = this.step * 8;
            } else if (symbol.startsWith('CRASH') && Math.random() < 0.02) {
                delta = -this.step * 8;
            }

            this.price += delta;
            if (this.price < 1) this.price = 10;

            const quote = Number(this.price.toFixed(this.pipSize));
            this.onTick({
                quote: quote,
                pip_size: this.pipSize,
                epoch: Math.floor(Date.now() / 1000),
                symbol: symbol
            });
        }, this.intervalMs);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

export class DerivWebSocketClient {
    constructor(url, appId, onHistory, onTick, onFail) {
        this.url = url;
        this.appId = appId;
        this.onHistory = onHistory;
        this.onTick = onTick;
        this.onFail = onFail;
        this.ws = null;
        this.pingTimer = null;
        this.connectionTimeout = null;
        this.activeSubscription = null;
        this.attempts = 0;
        this.maxAttempts = 2;
    }

    connect(symbol) {
        this.disconnect();

        updateConnectionUI('Connecting to Deriv WS...', 'reconnecting');
        const endpoint = `${this.url}?app_id=${this.appId}`;

        try {
            this.ws = new WebSocket(endpoint);
        } catch (err) {
            console.warn('WS creation failed:', err);
            if (this.onFail) this.onFail('WebSocket initialization failed');
            return;
        }

        // 3.5s timeout: if handshake doesn't complete, failover to synthetic stream
        this.connectionTimeout = setTimeout(() => {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                console.warn('Deriv WebSocket handshake timed out');
                this.disconnect();
                if (this.onFail) this.onFail('Handshake timeout');
            }
        }, 3500);

        this.ws.onopen = () => {
            if (this.connectionTimeout) clearTimeout(this.connectionTimeout);
            this.attempts = 0;
            updateConnectionUI('Connected (Deriv WS)', 'connected');
            showToast('Connected to Live Deriv WebSocket Feed', 'success');

            // 25s Heartbeat Ping to prevent connection drops
            this.pingTimer = setInterval(() => {
                if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                    this.ws.send(JSON.stringify({ ping: 1 }));
                }
            }, 25000);

            this.subscribe(symbol || AppState.currentSymbol);
        };

        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.msg_type === 'history') {
                    this.onHistory(message);
                } else if (message.tick) {
                    this.onTick(message.tick);
                } else if (message.error) {
                    console.warn('Deriv WS Warning:', message.error.message);
                    if (this.attempts >= this.maxAttempts && this.onFail) {
                        this.onFail(message.error.message);
                    }
                }
            } catch (err) {
                console.error('WS parse error', err);
            }
        };

        this.ws.onclose = (event) => {
            if (this.connectionTimeout) clearTimeout(this.connectionTimeout);
            if (this.pingTimer) clearInterval(this.pingTimer);

            this.attempts++;
            if (this.attempts >= this.maxAttempts) {
                console.warn(`Deriv WebSocket closed (code ${event.code}). Triggering failover.`);
                if (this.onFail) this.onFail(`WS closed (code ${event.code || 1006})`);
            } else {
                updateConnectionUI('Retrying Deriv WS...', 'reconnecting');
                setTimeout(() => this.connect(symbol), 1500);
            }
        };

        this.ws.onerror = (err) => {
            console.warn('Deriv WS Error', err);
        };
    }

    subscribe(symbol) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        if (this.activeSubscription) {
            try {
                this.ws.send(JSON.stringify({ forget: this.activeSubscription }));
            } catch (e) {}
            this.activeSubscription = null;
        }

        this.ws.send(JSON.stringify({
            ticks_history: symbol,
            adjust_start_time: 1,
            count: CONFIG.maxBuffer,
            end: 'latest',
            style: 'ticks',
            subscribe: 1
        }));
    }

    disconnect() {
        if (this.connectionTimeout) clearTimeout(this.connectionTimeout);
        if (this.pingTimer) clearInterval(this.pingTimer);
        if (this.ws) {
            this.ws.onopen = null;
            this.ws.onmessage = null;
            this.ws.onclose = null;
            this.ws.onerror = null;
            try { this.ws.close(); } catch (e) {}
            this.ws = null;
        }
    }
}

export class MarketFeedManager {
    constructor() {
        this.mode = localStorage.getItem('tradingpool_feed_mode') || 'auto';
        this.activeSource = 'synthetic';
        this.customAppId = localStorage.getItem('tradingpool_deriv_appid') || CONFIG.appId;

        this.syntheticProvider = new SyntheticFeedProvider(
            (data) => this.handleHistory(data),
            (tick) => this.handleTick(tick)
        );

        this.liveProvider = new DerivWebSocketClient(
            CONFIG.wsUrl,
            this.customAppId,
            (data) => this.handleHistory(data),
            (tick) => this.handleTick(tick),
            (reason) => this.handleLiveFailover(reason)
        );
    }

    start() {
        if (this.mode === 'synthetic') {
            this.activateSynthetic();
        } else {
            // In auto or live mode: start synthetic immediately so UI has data, then attempt live WS
            this.activateSynthetic();
            this.activateLive();
        }
    }

    activateLive() {
        this.activeSource = 'live';
        this.updateFeedModeUI();
        this.liveProvider.connect(AppState.currentSymbol);
    }

    activateSynthetic(isFailover = false) {
        this.liveProvider.disconnect();
        this.activeSource = 'synthetic';
        this.updateFeedModeUI();
        this.syntheticProvider.start(AppState.currentSymbol);

        updateConnectionUI('Active (Synthetic Stream)', 'synthetic');
        if (isFailover) {
            showToast('Deriv WebSocket throttled. Switched seamlessly to Synthetic Feed.', 'info');
        } else {
            showToast('Synthetic Market Feed Active', 'info');
        }
    }

    handleLiveFailover(reason) {
        if (this.mode === 'live') {
            updateConnectionUI('Disconnected (Live WS)', 'disconnected');
            showToast(`Deriv WS unavailable. Switch to Synthetic Stream to continue.`, 'error');
        } else {
            this.activateSynthetic(true);
        }
    }

    toggleMode() {
        if (this.activeSource === 'live') {
            this.mode = 'synthetic';
            localStorage.setItem('tradingpool_feed_mode', 'synthetic');
            this.activateSynthetic();
        } else {
            this.mode = 'live';
            localStorage.setItem('tradingpool_feed_mode', 'live');
            this.activateLive();
        }
    }

    setAppId(newAppId) {
        if (!newAppId || !newAppId.trim()) return;
        this.customAppId = newAppId.trim();
        localStorage.setItem('tradingpool_deriv_appid', this.customAppId);
        this.liveProvider.appId = this.customAppId;
        showToast(`Deriv App ID updated to ${this.customAppId}`, 'success');
        this.activateLive();
    }

    switchSymbol(symbol) {
        if (this.activeSource === 'live' && this.liveProvider.ws && this.liveProvider.ws.readyState === WebSocket.OPEN) {
            this.liveProvider.subscribe(symbol);
        } else {
            this.syntheticProvider.start(symbol);
        }
    }

    updateFeedModeUI() {
        const toggleBtn = document.getElementById('feed-toggle-btn');
        const labelEl = document.getElementById('feed-source-label');

        if (this.activeSource === 'live') {
            if (toggleBtn) {
                toggleBtn.className = 'sound-toggle-btn live active';
                toggleBtn.title = 'Current Feed: Live Deriv WebSocket (Click to switch to Synthetic Stream)';
            }
            if (labelEl) labelEl.innerText = t('feed_live_ws');
        } else {
            if (toggleBtn) {
                toggleBtn.className = 'sound-toggle-btn synthetic active';
                toggleBtn.title = 'Current Feed: Synthetic Market Stream (Click to switch to Live Deriv WebSocket)';
            }
            if (labelEl) labelEl.innerText = t('feed_synthetic');
        }
    }

    handleHistory(data) {
        if (!data.history || !data.history.prices) return;
        const prices = data.history.prices;
        const times = data.history.times;
        const pipSize = data.pip_size || 2;

        AppState.ticks = [];
        prices.forEach((p, idx) => {
            const price = Number(p);
            const digit = extractDigit(price, pipSize);
            AppState.ticks.push({ price, digit, time: times[idx] });
        });

        AppState.totalProcessed = AppState.ticks.length;
        rebuildTransitionMatrix();

        refreshDigitGrid();
        updateChartWithHistory();
        updateSummaryKPIs();
        renderTickTape();
        renderTransitionTable();

        if (AppState.ticks.length > 0) {
            const last = AppState.ticks[AppState.ticks.length - 1];
            updateHeroDigit(last.digit, last.price);
        }

        if (this.activeSource === 'live') {
            updateConnectionUI('Connected (Deriv WS)', 'connected');
        } else {
            updateConnectionUI('Active (Synthetic Stream)', 'synthetic');
        }
    }

    handleTick(tick) {
        if (tick.subscription && this.liveProvider) {
            this.liveProvider.activeSubscription = tick.subscription.id;
        }

        const price = Number(tick.quote);
        const pipSize = tick.pip_size || 2;
        const digit = extractDigit(price, pipSize);

        // Update Markov Transition
        if (AppState.ticks.length > 0) {
            const prevDigit = AppState.ticks[AppState.ticks.length - 1].digit;
            if (prevDigit >= 0 && prevDigit <= 9 && digit >= 0 && digit <= 9) {
                AppState.transitions[prevDigit][digit]++;
            }
        }

        AppState.ticks.push({ price, digit, time: tick.epoch || Math.floor(Date.now() / 1000) });
        if (AppState.ticks.length > CONFIG.maxBuffer) {
            AppState.ticks.shift();
        }
        AppState.totalProcessed++;

        // Efficient background processing: skip expensive DOM re-paints when tab is hidden
        const isHidden = typeof document !== 'undefined' && document.hidden;
        if (!isHidden) {
            updateHeroDigit(digit, price);
            pushTickToChart(price);
            refreshDigitGrid(digit);
            updateSummaryKPIs();
            renderTickTape();
            updateTransitionSummary(digit);

            if (AppState.isAnalyzing) {
                updateLiveStrategyOutput();
            }

            // Real-time Multi-Asset Screener sync (Feature 1)
            updateScreenerLiveAsset(AppState.currentSymbol, price, digit);
        }

        // Live Paper Trading Settlement & Auto-Trader Bot (always evaluate quantitative state)
        processPositionsOnTick(price, digit);
        runAutoTraderBot(price, digit);
    }
}

// --- UI Binding and Visual Updates ---

function updateConnectionUI(text, statusClass) {
    const textEl = document.getElementById('connection-text');
    const dotEl = document.getElementById('connection-dot');
    const subTextEl = document.getElementById('feed-subtext');

    if (textEl) textEl.innerText = text;
    if (dotEl) dotEl.className = `status-dot ${statusClass}`;
    if (subTextEl) {
        if (statusClass === 'connected') {
            subTextEl.innerText = `Live WS • ${AppState.currentSymbol}`;
        } else if (statusClass === 'synthetic') {
            subTextEl.innerText = `Synthetic Stream • ${AppState.currentSymbol}`;
        } else if (statusClass === 'reconnecting') {
            subTextEl.innerText = 'Connecting to market...';
        } else {
            subTextEl.innerText = 'Feed paused or disconnected';
        }
    }
}

function updateHeroDigit(digit, price) {
    const heroEl = document.getElementById('last-digit-display');
    const chartPriceEl = document.getElementById('chart-price');
    const chartTimeEl = document.getElementById('chart-time');

    if (heroEl) {
        heroEl.innerText = digit;
        heroEl.classList.remove('pulse');
        void heroEl.offsetWidth;
        heroEl.classList.add('pulse');
    }

    if (chartPriceEl) chartPriceEl.innerText = Number(price).toFixed(4);
    if (chartTimeEl) chartTimeEl.innerText = new Date().toLocaleTimeString();
}

/**
 * Renders the live 20-digit ticker ribbon and parity streak indicator.
 */
function renderTickTape() {
    const tapeEl = document.getElementById('tick-tape');
    const streakEl = document.getElementById('streak-indicator');
    if (!tapeEl) return;

    const recent = AppState.ticks.slice(-20);
    tapeEl.innerHTML = '';

    recent.forEach((t, index) => {
        const pill = document.createElement('div');
        const isEven = t.digit % 2 === 0;
        pill.className = `tape-digit-pill ${isEven ? 'even' : 'odd'}`;
        if (index === recent.length - 1) pill.classList.add('latest');
        pill.innerText = t.digit;
        tapeEl.appendChild(pill);
    });

    // Detect parity streak
    if (AppState.ticks.length > 0 && streakEl) {
        let streak = 0;
        const lastParity = AppState.ticks[AppState.ticks.length - 1].digit % 2;
        for (let i = AppState.ticks.length - 1; i >= 0; i--) {
            if (AppState.ticks[i].digit % 2 === lastParity) streak++;
            else break;
        }
        const label = lastParity === 0 ? 'EVENS' : 'ODDS';
        if (streak >= 3) {
            streakEl.innerHTML = `🔥 Streak: <strong style="color:${lastParity === 0 ? 'var(--primary-light)' : '#fbbf24'}">${streak} ${label}</strong>`;
            if (streak >= 5) playSignalChime(659.25, 'triangle');
        } else {
            streakEl.innerText = `Streak: ${streak} ${label}`;
        }
    }
}

/**
 * Refreshes the 0-9 Digit Grid based on active sample window.
 */
export function refreshDigitGrid(activeDigit = null) {
    const gridEl = document.getElementById('digit-grid');
    if (!gridEl) return;

    const windowTicks = getWindowTicks();
    const stats = analyzeDigitDistribution(windowTicks);

    // Initial build
    if (gridEl.children.length === 0) {
        gridEl.innerHTML = '';
        for (let i = 0; i <= 9; i++) {
            const card = document.createElement('div');
            card.className = 'digit-card';
            card.id = `digit-card-${i}`;
            card.innerHTML = `
                <div class="digit-num">${i}</div>
                <div class="digit-percentage" id="digit-pct-${i}">0.0%</div>
                <div class="digit-count-sub" id="digit-count-${i}">0 ticks</div>
            `;
            card.addEventListener('click', () => {
                showToast(`Digit ${i}: ${stats.counts[i]} hits in last ${windowTicks.length} ticks (${stats.percentages[i].toFixed(1)}%)`, 'info');
            });
            gridEl.appendChild(card);
        }
    }

    for (let i = 0; i <= 9; i++) {
        const card = document.getElementById(`digit-card-${i}`);
        const pctEl = document.getElementById(`digit-pct-${i}`);
        const countEl = document.getElementById(`digit-count-${i}`);
        if (!card) continue;

        const count = stats.counts[i];
        const pct = stats.percentages[i].toFixed(1);

        if (pctEl) pctEl.innerText = `${pct}%`;
        if (countEl) countEl.innerText = `${count} ticks`;

        card.className = 'digit-card';
        if (i === activeDigit) card.classList.add('active-pulse');

        if (stats.hotDigits.includes(i)) {
            card.classList.add('hot-digit');
            let badge = card.querySelector('.tag-badge');
            if (!badge) {
                badge = document.createElement('span');
                card.appendChild(badge);
            }
            badge.className = 'tag-badge hot';
            badge.innerText = 'HOT';
        } else if (stats.coldDigits.includes(i)) {
            card.classList.add('cold-digit');
            let badge = card.querySelector('.tag-badge');
            if (!badge) {
                badge = document.createElement('span');
                card.appendChild(badge);
            }
            badge.className = 'tag-badge cold';
            badge.innerText = 'COLD';
        } else {
            const existing = card.querySelector('.tag-badge');
            if (existing) existing.remove();
        }
    }

    // Update Entropy KPI
    const entropyEl = document.getElementById('entropy-value');
    if (entropyEl) entropyEl.innerText = stats.entropy.toFixed(3);
}

/**
 * Markov Transition Table Rendering
 */
function renderTransitionTable() {
    const tableEl = document.getElementById('transition-table');
    if (!tableEl) return;

    let html = '<thead><tr><th>From \\ To</th>';
    for (let j = 0; j <= 9; j++) html += `<th>${j}</th>`;
    html += '</tr></thead><tbody>';

    for (let i = 0; i <= 9; i++) {
        const rowTotal = AppState.transitions[i].reduce((a, b) => a + b, 0);
        html += `<tr><th>Digit ${i}</th>`;
        for (let j = 0; j <= 9; j++) {
            const count = AppState.transitions[i][j];
            const pct = rowTotal > 0 ? Math.round((count / rowTotal) * 100) : 0;
            const isTop = rowTotal > 0 && count === Math.max(...AppState.transitions[i]);
            html += `<td class="${isTop && pct > 12 ? 'highlight-cell' : ''}" title="Digit ${i} -> Digit ${j}: ${count} times (${pct}%)">${pct}%</td>`;
        }
        html += '</tr>';
    }
    html += '</tbody>';
    tableEl.innerHTML = html;
}

function updateTransitionSummary(currentDigit) {
    const summaryEl = document.getElementById('transition-summary-text');
    if (!summaryEl) return;

    const row = AppState.transitions[currentDigit];
    const total = row.reduce((a, b) => a + b, 0);
    if (total < 10) {
        summaryEl.innerText = `Collecting transition data for digit ${currentDigit}...`;
        return;
    }

    const maxCount = Math.max(...row);
    const nextDigit = row.indexOf(maxCount);
    const prob = ((maxCount / total) * 100).toFixed(1);

    summaryEl.innerHTML = `Current terminal digit is <strong>${currentDigit}</strong>. Historically, after ${currentDigit}, the most probable next digit is <strong style="color:var(--primary-light)">Digit ${nextDigit}</strong> (${prob}% of ${total} occurrences).`;
}

function updateSummaryKPIs() {
    const totalDigitsEl = document.getElementById('total-digits-count');
    const dataPointsEl = document.getElementById('data-points-count');
    const statHighEl = document.getElementById('stat-high');
    const statLowEl = document.getElementById('stat-low');
    const statCurrentEl = document.getElementById('stat-current');
    const statTrendEl = document.getElementById('stat-trend');

    if (totalDigitsEl) totalDigitsEl.innerText = AppState.totalProcessed.toLocaleString();
    if (dataPointsEl) dataPointsEl.innerText = AppState.ticks.length.toLocaleString();

    if (AppState.ticks.length > 0) {
        const recent = AppState.ticks.slice(-CONFIG.maxChartTicks);
        const prices = recent.map(t => t.price);
        const high = Math.max(...prices);
        const low = Math.min(...prices);
        const current = recent[recent.length - 1].price;
        const prev = recent.length > 1 ? recent[recent.length - 2].price : current;

        if (statHighEl) statHighEl.innerText = high.toFixed(2);
        if (statLowEl) statLowEl.innerText = low.toFixed(2);
        if (statCurrentEl) statCurrentEl.innerText = current.toFixed(2);

        if (statTrendEl) {
            if (current > prev) {
                statTrendEl.innerHTML = '<i class="fa-solid fa-arrow-trend-up"></i> UP';
                statTrendEl.className = 'kpi-value green';
            } else if (current < prev) {
                statTrendEl.innerHTML = '<i class="fa-solid fa-arrow-trend-down"></i> DOWN';
                statTrendEl.className = 'kpi-value red';
            } else {
                statTrendEl.innerText = '--';
                statTrendEl.className = 'kpi-value';
            }
        }
    }
}

export function updateLiveStrategyOutput() {
    const windowTicks = getWindowTicks();
    const pred = evaluateStrategyPrediction(AppState.activeStrategy, windowTicks, AppState.barrier);
    const feedStatusEl = document.getElementById('feed-status-text');
    const probBarEl = document.getElementById('confidence-level');
    const probPercentEl = document.getElementById('prob-percent');
    const signalBtnLabel = document.getElementById('signal-btn-label');

    if (!pred.valid) {
        if (feedStatusEl) feedStatusEl.innerText = pred.message;
        if (signalBtnLabel) signalBtnLabel.innerText = 'Wait';
        return;
    }

    if (feedStatusEl) {
        feedStatusEl.innerHTML = `Signal: <strong style="color: ${pred.isPositive ? '#34d399' : '#f87171'}">${pred.outcome}</strong> (${pred.confidence}%)`;
    }

    if (signalBtnLabel) {
        signalBtnLabel.innerText = pred.outcome;
    }

    if (probBarEl) probBarEl.style.width = `${pred.confidence}%`;
    if (probPercentEl) probPercentEl.innerText = `${pred.confidence}%`;

    // Strategy aware color update for chart points
    if (AppState.chart) AppState.chart.update('none');

    // Update estimated payout in order pad
    if (typeof updatePayoutEstimate === 'function') {
        updatePayoutEstimate();
    }
}

export function runManualPrediction() {
    const cardEl = document.getElementById('prediction-card');
    const strategyValEl = document.getElementById('p-strategy-val');
    const pValEl = document.getElementById('p-value');
    const analysisTextEl = document.getElementById('analysis-text');

    if (!cardEl) return;
    cardEl.style.display = 'block';

    const windowTicks = getWindowTicks();
    const pred = evaluateStrategyPrediction(AppState.activeStrategy, windowTicks, AppState.barrier);

    if (strategyValEl) strategyValEl.innerText = pred.strategy || AppState.activeStrategy;

    if (!pred.valid) {
        if (pValEl) {
            pValEl.innerText = 'Calculating...';
            pValEl.className = 'prediction-outcome';
        }
        if (analysisTextEl) analysisTextEl.innerText = pred.message;
        return;
    }

    if (pValEl) {
        pValEl.innerText = pred.outcome;
        pValEl.className = `prediction-outcome ${pred.isPositive ? 'green' : 'red'}`;
    }

    if (analysisTextEl) {
        analysisTextEl.innerText = pred.analysis;
    }

    updateLiveStrategyOutput();
    playSignalChime(523.25, 'sine');
    cardEl.scrollIntoView({ behavior: 'smooth' });
}

// --- CSV Export Functionality ---
export function exportTicksToCSV() {
    if (AppState.ticks.length === 0) {
        showToast('No tick data to export yet', 'error');
        return;
    }

    let csv = 'Timestamp,DateTime,Symbol,Price,TerminalDigit\n';
    AppState.ticks.forEach(t => {
        const d = new Date(t.time * 1000).toISOString();
        csv += `${t.time},${d},${AppState.currentSymbol},${t.price},${t.digit}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deriv_${AppState.currentSymbol}_ticks_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${AppState.ticks.length} ticks to CSV`, 'success');
}

// --- Chart.js Setup with Strategy-Aware Point Colors ---
function initChart() {
    if (typeof Chart === 'undefined') return;
    const canvas = document.getElementById('tickChart');
    if (!canvas) return;

    const colors = getThemeColors();
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, colors.chartFillStart);
    gradient.addColorStop(1, colors.chartFillEnd);

    AppState.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(CONFIG.maxChartTicks).fill(''),
            datasets: [{
                label: 'Price Quote',
                data: Array(CONFIG.maxChartTicks).fill(null),
                borderColor: colors.chartBorder,
                borderWidth: 2,
                pointRadius: 4.5,
                // Conditional point coloring based on current strategy
                pointBackgroundColor: (context) => {
                    const index = context.dataIndex;
                    const val = context.dataset.data[index];
                    const curColors = getThemeColors();
                    if (!val) return curColors.primary;

                    const digit = extractDigit(val);
                    const strat = AppState.activeStrategy;

                    if (strat === 'over_under') {
                        if (digit > AppState.barrier) return '#06b6d4'; // Cyan Over
                        if (digit < AppState.barrier) return '#ef4444'; // Red Under
                        return '#f59e0b'; // Exact barrier
                    }

                    if (strat === 'even_odd') {
                        return digit % 2 === 0 ? curColors.primary : '#f59e0b';
                    }

                    if (strat === 'matches') {
                        const dist = analyzeDigitDistribution(getWindowTicks());
                        if (digit === dist.maxOccurring) return '#10b981'; // Green for mode
                        return '#64748b';
                    }

                    return curColors.primary;
                },
                pointBorderColor: colors.pointBorder,
                pointBorderWidth: 1.5,
                tension: 0.3,
                fill: true,
                backgroundColor: gradient
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: colors.tooltipBg,
                    titleColor: colors.tickColor,
                    bodyColor: colors.tooltipText,
                    callbacks: {
                        label: (ctx) => {
                            const p = ctx.parsed.y;
                            return `Quote: ${p.toFixed(4)} (Digit: ${extractDigit(p)})`;
                        }
                    }
                }
            },
            scales: {
                x: { display: false },
                y: {
                    position: 'right',
                    grid: { color: colors.gridColor },
                    ticks: {
                        color: colors.tickColor,
                        font: { size: 10, family: 'Outfit' }
                    }
                }
            }
        }
    });
}

function updateChartWithHistory() {
    if (!AppState.chart) return;
    const recent = AppState.ticks.slice(-CONFIG.maxChartTicks);
    const dataArray = Array(CONFIG.maxChartTicks).fill(null);
    recent.forEach((t, i) => {
        const offset = CONFIG.maxChartTicks - recent.length + i;
        dataArray[offset] = t.price;
    });
    AppState.chart.data.datasets[0].data = dataArray;
    AppState.chart.update();
}

function pushTickToChart(price) {
    if (!AppState.chart) return;
    const data = AppState.chart.data.datasets[0].data;
    data.push(price);
    if (data.length > CONFIG.maxChartTicks) data.shift();
    AppState.chart.update();
}

// ==========================================================================
// Paper Trading & Automated Bot Simulation Engine
// ==========================================================================

export const PaperTradingState = {
    initialBalance: 10000,
    balance: 10000,
    trades: [], // Array of completed trades
    activePositions: [], // Positions currently in-flight awaiting settlement
    defaultStake: 10,
    durationTicks: 1,
    filter: 'all',
    equityChart: null,
    bot: {
        enabled: false,
        minConfidence: 55,
        stakingPlan: 'flat', // 'flat', 'martingale', 'dalembert'
        martingaleMultiplier: 2.0,
        takeProfit: 200,
        stopLoss: 100,
        maxConsecutiveLosses: 5,
        consecutiveLosses: 0,
        consecutiveWins: 0
    }
};

function savePaperTradingData() {
    try {
        localStorage.setItem('tradingpool_paper_balance', PaperTradingState.balance.toString());
        localStorage.setItem('tradingpool_paper_trades', JSON.stringify(PaperTradingState.trades.slice(0, 500)));
        localStorage.setItem('tradingpool_paper_stake', PaperTradingState.defaultStake.toString());
        localStorage.setItem('tradingpool_paper_duration', PaperTradingState.durationTicks.toString());
        localStorage.setItem('tradingpool_bot_config', JSON.stringify({
            minConfidence: PaperTradingState.bot.minConfidence,
            stakingPlan: PaperTradingState.bot.stakingPlan,
            takeProfit: PaperTradingState.bot.takeProfit,
            stopLoss: PaperTradingState.bot.stopLoss
        }));
    } catch (e) {
        // Storage limit or sandbox
    }
}

function loadPaperTradingData() {
    try {
        const savedBal = localStorage.getItem('tradingpool_paper_balance');
        if (savedBal !== null) PaperTradingState.balance = parseFloat(savedBal);

        const savedTrades = localStorage.getItem('tradingpool_paper_trades');
        if (savedTrades) PaperTradingState.trades = JSON.parse(savedTrades);

        const savedStake = localStorage.getItem('tradingpool_paper_stake');
        if (savedStake) PaperTradingState.defaultStake = parseFloat(savedStake);

        const savedDuration = localStorage.getItem('tradingpool_paper_duration');
        if (savedDuration) PaperTradingState.durationTicks = parseInt(savedDuration, 10);

        const savedBot = localStorage.getItem('tradingpool_bot_config');
        if (savedBot) {
            const parsed = JSON.parse(savedBot);
            if (parsed.minConfidence !== undefined) PaperTradingState.bot.minConfidence = parsed.minConfidence;
            if (parsed.stakingPlan) PaperTradingState.bot.stakingPlan = parsed.stakingPlan;
            if (parsed.takeProfit !== undefined) PaperTradingState.bot.takeProfit = parsed.takeProfit;
            if (parsed.stopLoss !== undefined) PaperTradingState.bot.stopLoss = parsed.stopLoss;
        }
    } catch (e) {}
}

export function calculateContractPayout(contractType, targetValue = null) {
    switch (contractType) {
        case 'EVEN':
        case 'ODD':
        case 'RISE':
        case 'FALL':
        case 'UP':
        case 'DOWN':
            return { rate: 0.95, label: '95%' };

        case 'OVER': {
            const barrier = Number(targetValue !== null ? targetValue : AppState.barrier);
            const winDigits = 9 - barrier;
            const prob = Math.max(0.1, winDigits / 10);
            const rate = Math.max(0.05, (0.95 / prob) - 1);
            return { rate: rate, label: `${Math.round(rate * 100)}%` };
        }

        case 'UNDER': {
            const barrier = Number(targetValue !== null ? targetValue : AppState.barrier);
            const winDigits = barrier;
            const prob = Math.max(0.1, winDigits / 10);
            const rate = Math.max(0.05, (0.95 / prob) - 1);
            return { rate: rate, label: `${Math.round(rate * 100)}%` };
        }

        case 'MATCHES':
            return { rate: 8.00, label: '800%' };

        case 'DIFFERS':
            return { rate: 0.09, label: '9%' };

        default:
            return { rate: 0.95, label: '95%' };
    }
}

export function updatePayoutEstimate() {
    if (typeof document === 'undefined') return;
    const estEl = document.getElementById('payout-estimate-text');
    if (!estEl) return;

    const stake = PaperTradingState.defaultStake;
    const strat = AppState.activeStrategy;
    let payoutInfo = { rate: 0.95, label: '95%' };

    if (strat === 'even_odd') payoutInfo = calculateContractPayout('EVEN');
    else if (strat === 'over_under') payoutInfo = calculateContractPayout('OVER', AppState.barrier);
    else if (strat === 'matches') payoutInfo = calculateContractPayout('MATCHES');
    else if (strat === 'rise_fall') payoutInfo = calculateContractPayout('RISE');
    else if (strat === 'up_down') payoutInfo = calculateContractPayout('UP');

    const profit = (stake * payoutInfo.rate).toFixed(2);
    estEl.innerText = `Est. Profit: +$${profit} (${payoutInfo.label})`;
}

export function updatePaperBalanceUI() {
    if (typeof document === 'undefined') return;
    const balEl = document.getElementById('paper-balance-display');
    const pnlPill = document.getElementById('paper-pnl-pill');
    const equityEl = document.getElementById('paper-stat-equity');

    const bal = PaperTradingState.balance;
    const initial = PaperTradingState.initialBalance;
    const diff = bal - initial;
    const diffPct = ((diff / initial) * 100).toFixed(2);
    const sign = diff >= 0 ? '+' : '';

    if (balEl) balEl.innerText = `$${bal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (equityEl) equityEl.innerText = `$${bal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    if (pnlPill) {
        pnlPill.innerText = `${sign}$${diff.toFixed(2)} (${sign}${diffPct}%)`;
        pnlPill.className = `paper-pnl-pill ${diff < 0 ? 'negative' : ''}`;
    }
}

export function updatePaperKPIs() {
    if (typeof document === 'undefined') return;
    const pnlEl = document.getElementById('paper-stat-pnl');
    const winrateEl = document.getElementById('paper-stat-winrate');
    const tradesEl = document.getElementById('paper-stat-trades');
    const profitFactorEl = document.getElementById('paper-stat-profitfactor');
    const streakEl = document.getElementById('paper-stat-streak');

    const trades = PaperTradingState.trades;
    const total = trades.length;
    const wins = trades.filter(t => t.status === 'WON');
    const losses = trades.filter(t => t.status === 'LOST');

    const netPnl = PaperTradingState.balance - PaperTradingState.initialBalance;
    const sign = netPnl >= 0 ? '+' : '';

    if (pnlEl) {
        pnlEl.innerText = `${sign}$${netPnl.toFixed(2)}`;
        pnlEl.className = `kpi-value ${netPnl >= 0 ? 'green' : 'red'}`;
    }

    if (winrateEl) {
        const rate = total > 0 ? ((wins.length / total) * 100).toFixed(1) : '0.0';
        winrateEl.innerText = `${rate}%`;
    }

    if (tradesEl) {
        tradesEl.innerText = `${total} (${wins.length}W / ${losses.length}L)`;
    }

    if (profitFactorEl) {
        const grossProfit = wins.reduce((acc, t) => acc + (t.profit || 0), 0);
        const grossLoss = losses.reduce((acc, t) => acc + Math.abs(t.profit || 0), 0);
        const pf = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : (grossProfit > 0 ? '∞' : '0.00');
        profitFactorEl.innerText = pf;
    }

    if (streakEl) {
        if (total === 0) {
            streakEl.innerText = 'None';
            streakEl.className = 'kpi-value';
        } else {
            let streakCount = 0;
            const streakType = trades[0].status;
            for (let i = 0; i < trades.length; i++) {
                if (trades[i].status === streakType) streakCount++;
                else break;
            }
            if (streakType === 'WON') {
                streakEl.innerHTML = `🔥 ${streakCount} Wins`;
                streakEl.className = 'kpi-value green';
            } else {
                streakEl.innerHTML = `❄️ ${streakCount} Losses`;
                streakEl.className = 'kpi-value red';
            }
        }
    }
}

export function renderManualOrderButtons() {
    const container = document.getElementById('paper-manual-buttons');
    if (!container) return;

    container.innerHTML = '';
    const strat = AppState.activeStrategy;

    if (strat === 'even_odd') {
        const btnEven = document.createElement('button');
        btnEven.className = 'btn-paper-action btn-paper-blue';
        btnEven.innerHTML = `${t('bet_even')} <span class="action-sub">Payout: 95%</span>`;
        btnEven.addEventListener('click', () => executePaperTrade('EVEN'));

        const btnOdd = document.createElement('button');
        btnOdd.className = 'btn-paper-action btn-paper-amber';
        btnOdd.innerHTML = `${t('bet_odd')} <span class="action-sub">Payout: 95%</span>`;
        btnOdd.addEventListener('click', () => executePaperTrade('ODD'));

        container.appendChild(btnEven);
        container.appendChild(btnOdd);
    } else if (strat === 'over_under') {
        const barrier = AppState.barrier;
        const overInfo = calculateContractPayout('OVER', barrier);
        const underInfo = calculateContractPayout('UNDER', barrier);

        const btnOver = document.createElement('button');
        btnOver.className = 'btn-paper-action btn-paper-blue';
        btnOver.innerHTML = `OVER > ${barrier} <span class="action-sub">Payout: ${overInfo.label}</span>`;
        btnOver.addEventListener('click', () => executePaperTrade('OVER', barrier));

        const btnUnder = document.createElement('button');
        btnUnder.className = 'btn-paper-action btn-paper-red';
        btnUnder.innerHTML = `UNDER < ${barrier} <span class="action-sub">Payout: ${underInfo.label}</span>`;
        btnUnder.addEventListener('click', () => executePaperTrade('UNDER', barrier));

        container.appendChild(btnOver);
        container.appendChild(btnUnder);
    } else if (strat === 'matches') {
        const dist = analyzeDigitDistribution(getWindowTicks());
        const target = dist.maxOccurring;

        const btnMatch = document.createElement('button');
        btnMatch.className = 'btn-paper-action btn-paper-green';
        btnMatch.innerHTML = `MATCH (${target}) <span class="action-sub">Payout: 800%</span>`;
        btnMatch.addEventListener('click', () => executePaperTrade('MATCHES', target));

        const btnDiff = document.createElement('button');
        btnDiff.className = 'btn-paper-action btn-paper-amber';
        btnDiff.innerHTML = `DIFFERS (${target}) <span class="action-sub">Payout: 9%</span>`;
        btnDiff.addEventListener('click', () => executePaperTrade('DIFFERS', target));

        container.appendChild(btnMatch);
        container.appendChild(btnDiff);
    } else if (strat === 'rise_fall') {
        const btnRise = document.createElement('button');
        btnRise.className = 'btn-paper-action btn-paper-green';
        btnRise.innerHTML = `RISE <span class="action-sub">Payout: 95%</span>`;
        btnRise.addEventListener('click', () => executePaperTrade('RISE'));

        const btnFall = document.createElement('button');
        btnFall.className = 'btn-paper-action btn-paper-red';
        btnFall.innerHTML = `FALL <span class="action-sub">Payout: 95%</span>`;
        btnFall.addEventListener('click', () => executePaperTrade('FALL'));

        container.appendChild(btnRise);
        container.appendChild(btnFall);
    } else if (strat === 'up_down') {
        const btnUp = document.createElement('button');
        btnUp.className = 'btn-paper-action btn-paper-blue';
        btnUp.innerHTML = `UP (Digit) <span class="action-sub">Payout: 95%</span>`;
        btnUp.addEventListener('click', () => executePaperTrade('UP'));

        const btnDown = document.createElement('button');
        btnDown.className = 'btn-paper-action btn-paper-amber';
        btnDown.innerHTML = `DOWN (Digit) <span class="action-sub">Payout: 95%</span>`;
        btnDown.addEventListener('click', () => executePaperTrade('DOWN'));

        container.appendChild(btnUp);
        container.appendChild(btnDown);
    }

    updatePayoutEstimate();
}

export function executePaperTrade(contractType, targetValue = null) {
    if (AppState.ticks.length === 0) {
        showToast('Waiting for market tick stream...', 'error');
        return false;
    }

    const stake = PaperTradingState.defaultStake;
    if (stake <= 0) {
        showToast('Stake amount must be greater than $0', 'error');
        return false;
    }

    if (PaperTradingState.balance < stake) {
        showToast(`Insufficient virtual balance ($${PaperTradingState.balance.toFixed(2)}) for stake ($${stake.toFixed(2)})`, 'error');
        return false;
    }

    // Canonical contract normalization (handles 'Even', 'EVEN', 'Over 5', 'OVER', 'Matches', etc.)
    let canonicalType = String(contractType).trim().toUpperCase();
    let target = targetValue;

    if (canonicalType.includes('EVEN')) canonicalType = 'EVEN';
    else if (canonicalType.includes('ODD')) canonicalType = 'ODD';
    else if (canonicalType.includes('OVER')) {
        canonicalType = 'OVER';
        const numMatch = contractType.toString().match(/\d+/);
        if (numMatch && target === null) target = parseInt(numMatch[0], 10);
        if (target === null) target = AppState.barrier;
    } else if (canonicalType.includes('UNDER')) {
        canonicalType = 'UNDER';
        const numMatch = contractType.toString().match(/\d+/);
        if (numMatch && target === null) target = parseInt(numMatch[0], 10);
        if (target === null) target = AppState.barrier;
    } else if (canonicalType.includes('DIFF')) {
        canonicalType = 'DIFFERS';
        const numMatch = contractType.toString().match(/\d+/);
        if (numMatch && target === null) target = parseInt(numMatch[0], 10);
    } else if (canonicalType.includes('MATCH')) {
        canonicalType = 'MATCHES';
        const numMatch = contractType.toString().match(/\d+/);
        if (numMatch && target === null) target = parseInt(numMatch[0], 10);
    } else if (canonicalType.includes('RISE')) canonicalType = 'RISE';
    else if (canonicalType.includes('FALL')) canonicalType = 'FALL';
    else if (canonicalType.includes('UP')) canonicalType = 'UP';
    else if (canonicalType.includes('DOWN')) canonicalType = 'DOWN';

    if (target === null) {
        if (canonicalType === 'OVER' || canonicalType === 'UNDER') target = AppState.barrier;
        else if (canonicalType === 'MATCHES' || canonicalType === 'DIFFERS') {
            const dist = analyzeDigitDistribution(getWindowTicks());
            target = dist.maxOccurring;
        }
    }

    // Deduct stake upfront
    PaperTradingState.balance = Number((PaperTradingState.balance - stake).toFixed(2));
    updatePaperBalanceUI();

    const lastTick = AppState.ticks[AppState.ticks.length - 1];
    const duration = PaperTradingState.durationTicks;

    const newPosition = {
        id: 'ord_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        time: Math.floor(Date.now() / 1000),
        symbol: AppState.currentSymbol,
        strategy: AppState.activeStrategy,
        contractType: canonicalType,
        targetValue: target,
        entryPrice: lastTick.price,
        entryDigit: lastTick.digit,
        stake: stake,
        duration: duration,
        ticksRemaining: duration,
        status: 'PENDING'
    };

    PaperTradingState.activePositions.push(newPosition);
    renderActivePositions();
    playSignalChime(440, 'sine');
    showToast(`Order Placed: ${newPosition.contractType} ${newPosition.targetValue !== null ? `(${newPosition.targetValue})` : ''} • Stake: $${stake.toFixed(2)}`, 'info');
    return true;
}

export function processPositionsOnTick(price, digit) {
    if (PaperTradingState.activePositions.length === 0) return;

    const remainingPositions = [];

    for (const pos of PaperTradingState.activePositions) {
        pos.ticksRemaining--;

        if (pos.ticksRemaining <= 0) {
            settlePosition(pos, price, digit);
        } else {
            remainingPositions.push(pos);
        }
    }

    PaperTradingState.activePositions = remainingPositions;
    renderActivePositions();
}

function settlePosition(pos, exitPrice, exitDigit) {
    let won = false;
    const payoutInfo = calculateContractPayout(pos.contractType, pos.targetValue);
    const payoutRate = payoutInfo.rate;

    switch (pos.contractType) {
        case 'EVEN':
            won = (exitDigit % 2 === 0);
            break;
        case 'ODD':
            won = (exitDigit % 2 !== 0);
            break;
        case 'OVER': {
            const barrier = Number(pos.targetValue);
            won = (exitDigit > barrier);
            break;
        }
        case 'UNDER': {
            const barrier = Number(pos.targetValue);
            won = (exitDigit < barrier);
            break;
        }
        case 'MATCHES': {
            const target = Number(pos.targetValue);
            won = (exitDigit === target);
            break;
        }
        case 'DIFFERS': {
            const target = Number(pos.targetValue);
            won = (exitDigit !== target);
            break;
        }
        case 'RISE':
            won = (exitPrice > pos.entryPrice);
            break;
        case 'FALL':
            won = (exitPrice < pos.entryPrice);
            break;
        case 'UP':
            won = (exitDigit > pos.entryDigit);
            break;
        case 'DOWN':
            won = (exitDigit < pos.entryDigit);
            break;
        default:
            won = false;
    }

    let profit = 0;
    let payout = 0;

    if (won) {
        profit = Number((pos.stake * payoutRate).toFixed(2));
        payout = Number((pos.stake + profit).toFixed(2));
        PaperTradingState.balance = Number((PaperTradingState.balance + payout).toFixed(2));
        pos.status = 'WON';
        pos.profit = profit;
        pos.payout = payout;

        PaperTradingState.bot.consecutiveWins++;
        PaperTradingState.bot.consecutiveLosses = 0;

        playWinChime();
        showToast(`Trade Won! +$${profit.toFixed(2)} (${pos.contractType})`, 'success');
    } else {
        profit = -Number(pos.stake.toFixed(2));
        payout = 0;
        pos.status = 'LOST';
        pos.profit = profit;
        pos.payout = 0;

        PaperTradingState.bot.consecutiveLosses++;
        PaperTradingState.bot.consecutiveWins = 0;

        playLossTone();
        showToast(`Trade Lost: -$${pos.stake.toFixed(2)} (${pos.contractType})`, 'error');
    }

    pos.exitPrice = exitPrice;
    pos.exitDigit = exitDigit;
    pos.settledTime = Math.floor(Date.now() / 1000);
    pos.balanceAfter = Number(PaperTradingState.balance.toFixed(2));

    PaperTradingState.trades.unshift(pos);
    if (PaperTradingState.trades.length > 500) PaperTradingState.trades.pop();

    savePaperTradingData();

    updatePaperBalanceUI();
    updatePaperKPIs();
    renderTradeHistoryTable();
    pushEquityPoint(PaperTradingState.balance);
}

export function renderActivePositions() {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('active-positions-container');
    const list = document.getElementById('active-positions-list');
    if (!container || !list) return;

    if (PaperTradingState.activePositions.length === 0) {
        container.style.display = 'none';
        list.innerHTML = '';
        return;
    }

    container.style.display = 'block';
    list.innerHTML = '';

    PaperTradingState.activePositions.forEach(pos => {
        const card = document.createElement('div');
        card.className = 'position-card';

        let badgeClass = 'even';
        const typeLower = pos.contractType.toLowerCase();
        if (typeLower.includes('odd')) badgeClass = 'odd';
        else if (typeLower.includes('over')) badgeClass = 'over';
        else if (typeLower.includes('under')) badgeClass = 'under';
        else if (typeLower.includes('match') || typeLower.includes('rise')) badgeClass = 'match';
        else if (typeLower.includes('fall')) badgeClass = 'fall';

        const ticksDone = pos.duration - pos.ticksRemaining;
        const progressPct = Math.round((ticksDone / pos.duration) * 100);

        card.innerHTML = `
            <div class="pos-card-top">
                <span class="pos-symbol">${pos.symbol}</span>
                <span class="pos-type-badge ${badgeClass}">${pos.contractType} ${pos.targetValue !== null ? `(${pos.targetValue})` : ''}</span>
            </div>
            <div class="pos-meta-row">
                <span>Entry: <strong>${pos.entryPrice.toFixed(4)}</strong> [${pos.entryDigit}]</span>
                <span>Stake: <strong>$${pos.stake.toFixed(2)}</strong></span>
            </div>
            <div class="pos-meta-row">
                <span>Remaining: <strong style="color:var(--primary-light)">${pos.ticksRemaining} tick${pos.ticksRemaining > 1 ? 's' : ''}</strong></span>
                <span>Duration: ${pos.duration}t</span>
            </div>
            <div class="pos-progress-bar-bg">
                <div class="pos-progress-bar-fill" style="width: ${progressPct}%"></div>
            </div>
        `;
        list.appendChild(card);
    });
}

export function renderTradeHistoryTable() {
    if (typeof document === 'undefined') return;
    const tbody = document.getElementById('trade-history-tbody');
    if (!tbody) return;

    let trades = PaperTradingState.trades;
    if (PaperTradingState.filter === 'won') {
        trades = trades.filter(t => t.status === 'WON');
    } else if (PaperTradingState.filter === 'lost') {
        trades = trades.filter(t => t.status === 'LOST');
    }

    if (trades.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="11">No simulated trades found in this view.</td>
            </tr>
        `;
        return;
    }

    let html = '';
    trades.forEach((t, index) => {
        const timeStr = t.settledTime ? new Date(t.settledTime * 1000).toLocaleTimeString() : '--:--:--';
        const isWon = t.status === 'WON';
        const pnlStr = isWon ? `+$${t.profit.toFixed(2)}` : `-$${Math.abs(t.profit).toFixed(2)}`;
        const pnlColor = isWon ? '#34d399' : '#f87171';

        html += `
            <tr>
                <td>#${PaperTradingState.trades.length - index}</td>
                <td>${timeStr}</td>
                <td><strong>${t.symbol}</strong></td>
                <td>${t.contractType}</td>
                <td>${t.targetValue !== null ? t.targetValue : '-'}</td>
                <td>${Number(t.entryPrice).toFixed(4)} [${t.entryDigit}]</td>
                <td>${Number(t.exitPrice).toFixed(4)} [${t.exitDigit}]</td>
                <td>$${Number(t.stake).toFixed(2)}</td>
                <td style="color:${pnlColor}; font-weight:700;">${pnlStr}</td>
                <td>$${Number(t.balanceAfter).toFixed(2)}</td>
                <td><span class="badge-result ${isWon ? 'won' : 'lost'}">${t.status}</span></td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

export function initEquityChart() {
    if (typeof Chart === 'undefined') return;
    const canvas = document.getElementById('equityChart');
    if (!canvas) return;

    const colors = getThemeColors();
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 140);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    // Build initial points from trade history (chronological: oldest to newest)
    const chronological = [...PaperTradingState.trades].reverse();
    const dataPoints = [PaperTradingState.initialBalance];
    const labels = ['Start'];

    chronological.forEach((t, i) => {
        dataPoints.push(t.balanceAfter);
        labels.push(`#${i + 1}`);
    });

    const ptsCountEl = document.getElementById('equity-points-count');
    if (ptsCountEl) ptsCountEl.innerText = `Starting Capital: $10,000.00 | Trades Recorded: ${chronological.length}`;

    PaperTradingState.equityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Virtual Balance ($)',
                data: dataPoints,
                borderColor: '#10b981',
                borderWidth: 2,
                pointRadius: chronological.length > 30 ? 0 : 3.5,
                pointBackgroundColor: '#10b981',
                pointBorderColor: colors.pointBorder,
                pointBorderWidth: 1.5,
                tension: 0.25,
                fill: true,
                backgroundColor: gradient
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: colors.tooltipBg,
                    titleColor: colors.tickColor,
                    bodyColor: colors.tooltipText,
                    callbacks: {
                        label: (ctx) => `Equity: $${ctx.parsed.y.toFixed(2)}`
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        color: colors.tickColor,
                        font: { size: 9, family: 'Outfit' },
                        maxTicksLimit: 12
                    }
                },
                y: {
                    position: 'right',
                    grid: { color: colors.equityGrid },
                    ticks: {
                        color: colors.tickColor,
                        font: { size: 9, family: 'Outfit' },
                        callback: (val) => `$${val}`
                    }
                }
            }
        }
    });
}

export function pushEquityPoint(balance) {
    if (typeof document === 'undefined') return;
    if (!PaperTradingState.equityChart) return;
    const chart = PaperTradingState.equityChart;
    const labels = chart.data.labels;
    const data = chart.data.datasets[0].data;

    labels.push(`#${labels.length}`);
    data.push(balance);

    if (labels.length > 100) {
        labels.shift();
        data.shift();
    }

    // Dynamic color: green if >= initial, red if below
    const isProfitable = balance >= PaperTradingState.initialBalance;
    chart.data.datasets[0].borderColor = isProfitable ? '#10b981' : '#ef4444';
    chart.data.datasets[0].pointBackgroundColor = isProfitable ? '#10b981' : '#ef4444';

    const ptsCountEl = document.getElementById('equity-points-count');
    if (ptsCountEl) ptsCountEl.innerText = `Starting Capital: $10,000.00 | Trades Recorded: ${PaperTradingState.trades.length}`;

    chart.update();
}

export function runAutoTraderBot(price, digit) {
    const termEl = typeof document !== 'undefined' ? document.getElementById('bot-status-terminal') : null;

    if (!PaperTradingState.bot.enabled) {
        if (termEl && !termEl.dataset.pausedShown) {
            termEl.innerHTML = `<i class="fa-solid fa-power-off" style="color:#64748b"></i> <span>Auto-Bot is paused. Switch toggle ON above to automate trades.</span>`;
            termEl.dataset.pausedShown = '1';
        }
        return;
    }
    if (termEl) delete termEl.dataset.pausedShown;

    // 1. Check Circuit Breakers
    const netPnl = PaperTradingState.balance - PaperTradingState.initialBalance;

    if (netPnl >= PaperTradingState.bot.takeProfit) {
        PaperTradingState.bot.enabled = false;
        const toggle = typeof document !== 'undefined' ? document.getElementById('bot-power-toggle') : null;
        if (toggle) toggle.checked = false;
        updateBotUI();
        if (termEl) termEl.innerHTML = `<i class="fa-solid fa-flag-checkered" style="color:#10b981"></i> <span>Take Profit reached (+$${netPnl.toFixed(2)}). Bot stopped.</span>`;
        showToast(`Auto-Bot: Take Profit Target (+$${PaperTradingState.bot.takeProfit}) Reached!`, 'success');
        return;
    }

    if (netPnl <= -PaperTradingState.bot.stopLoss) {
        PaperTradingState.bot.enabled = false;
        const toggle = typeof document !== 'undefined' ? document.getElementById('bot-power-toggle') : null;
        if (toggle) toggle.checked = false;
        updateBotUI();
        if (termEl) termEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:#ef4444"></i> <span>Stop Loss hit (-$${Math.abs(netPnl).toFixed(2)}). Bot stopped.</span>`;
        showToast(`Auto-Bot: Stop Loss Limit (-$${PaperTradingState.bot.stopLoss}) Hit!`, 'error');
        return;
    }

    if (PaperTradingState.bot.consecutiveLosses >= PaperTradingState.bot.maxConsecutiveLosses) {
        PaperTradingState.bot.enabled = false;
        const toggle = typeof document !== 'undefined' ? document.getElementById('bot-power-toggle') : null;
        if (toggle) toggle.checked = false;
        updateBotUI();
        if (termEl) termEl.innerHTML = `<i class="fa-solid fa-hand" style="color:#ef4444"></i> <span>Max consecutive losses (${PaperTradingState.bot.consecutiveLosses}) reached. Safety trip.</span>`;
        showToast('Auto-Bot: Circuit breaker tripped after 5 consecutive losses', 'error');
        return;
    }

    // 2. Only 1 active position open at a time
    if (PaperTradingState.activePositions.length > 0) {
        const active = PaperTradingState.activePositions[0];
        if (termEl) termEl.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="color:var(--primary-light)"></i> <span>Settling ${active.contractType}: ${active.ticksRemaining} tick${active.ticksRemaining > 1 ? 's' : ''} left...</span>`;
        return;
    }

    // 3. Evaluate Signal
    const windowTicks = getWindowTicks();
    const pred = evaluateStrategyPrediction(AppState.activeStrategy, windowTicks, AppState.barrier);

    if (!pred.valid) {
        if (termEl) termEl.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> <span>Accumulating ticks for strategy evaluation...</span>`;
        return;
    }

    if (pred.confidence < PaperTradingState.bot.minConfidence) {
        if (termEl) termEl.innerHTML = `<i class="fa-solid fa-satellite-dish" style="color:#f59e0b"></i> <span>Scanning ${AppState.currentSymbol}: ${pred.outcome} (${pred.confidence}%) &lt; trigger (${PaperTradingState.bot.minConfidence}%)</span>`;
        return;
    }

    // 4. Determine Stake
    let stake = PaperTradingState.defaultStake;
    const plan = PaperTradingState.bot.stakingPlan;

    if (plan === 'martingale') {
        const lastTrade = PaperTradingState.trades[0];
        if (lastTrade && lastTrade.status === 'LOST') {
            stake = Number((lastTrade.stake * PaperTradingState.bot.martingaleMultiplier).toFixed(2));
            stake = Math.min(stake, 500, Math.floor(PaperTradingState.balance * 0.2));
        } else {
            stake = PaperTradingState.defaultStake;
        }
    } else if (plan === 'dalembert') {
        const lastTrade = PaperTradingState.trades[0];
        const unit = PaperTradingState.defaultStake;
        if (lastTrade && lastTrade.status === 'LOST') {
            stake = Number((lastTrade.stake + unit).toFixed(2));
        } else if (lastTrade && lastTrade.status === 'WON') {
            stake = Math.max(unit, Number((lastTrade.stake - unit).toFixed(2)));
        }
    }

    const origStake = PaperTradingState.defaultStake;
    PaperTradingState.defaultStake = stake;

    let target = null;
    if (AppState.activeStrategy === 'over_under') target = AppState.barrier;
    else if (AppState.activeStrategy === 'matches') {
        const dist = analyzeDigitDistribution(windowTicks);
        target = dist.maxOccurring;
    }

    const executed = executePaperTrade(pred.outcome, target);
    PaperTradingState.defaultStake = origStake; // restore user input

    if (executed && termEl) {
        termEl.innerHTML = `<i class="fa-solid fa-robot" style="color:#10b981"></i> <strong>Triggered ${pred.outcome}</strong> (${pred.confidence}% Conf) • Stake: $${stake.toFixed(2)}`;
    }
}

export function updateBotUI() {
    if (typeof document === 'undefined') return;
    const badge = document.getElementById('bot-mode-badge');
    const desc = document.getElementById('bot-state-description');
    const isEnabled = PaperTradingState.bot.enabled;

    if (badge) {
        badge.innerHTML = isEnabled 
            ? `<i class="fa-solid fa-robot"></i> ${t('bot_active')}` 
            : `<i class="fa-solid fa-gamepad"></i> ${t('manual_tab')}`;
        badge.className = `paper-badge-mode ${isEnabled ? 'bot-active' : ''}`;
    }

    if (desc) {
        desc.innerText = isEnabled 
            ? `${t('bot_active')} (Target: >= ${PaperTradingState.bot.minConfidence}% Conf)` 
            : t('bot_inactive');
    }
}

export function resetPaperAccount() {
    if (!confirm('Are you sure you want to reset your virtual balance to $10,000.00 and clear the trade ledger?')) {
        return;
    }

    PaperTradingState.balance = PaperTradingState.initialBalance;
    PaperTradingState.trades = [];
    PaperTradingState.activePositions = [];
    PaperTradingState.bot.consecutiveLosses = 0;
    PaperTradingState.bot.consecutiveWins = 0;

    savePaperTradingData();
    updatePaperBalanceUI();
    updatePaperKPIs();
    renderActivePositions();
    renderTradeHistoryTable();

    if (PaperTradingState.equityChart) {
        PaperTradingState.equityChart.data.labels = ['Start'];
        PaperTradingState.equityChart.data.datasets[0].data = [PaperTradingState.initialBalance];
        PaperTradingState.equityChart.update();
    }

    showToast('Virtual Balance Reset to $10,000.00', 'success');
}

export function exportTradesToCSV() {
    if (PaperTradingState.trades.length === 0) {
        showToast('No paper trades recorded to export yet', 'error');
        return;
    }

    let csv = 'TradeID,Timestamp,ISOTime,Symbol,Strategy,ContractType,Target,EntryPrice,EntryDigit,ExitPrice,ExitDigit,Stake,ProfitLoss,BalanceAfter,Status\n';
    PaperTradingState.trades.forEach(t => {
        const iso = t.settledTime ? new Date(t.settledTime * 1000).toISOString() : '';
        csv += `${t.id},${t.settledTime || ''},${iso},${t.symbol},${t.strategy},${t.contractType},${t.targetValue !== null ? t.targetValue : ''},${t.entryPrice},${t.entryDigit},${t.exitPrice},${t.exitDigit},${t.stake},${t.profit},${t.balanceAfter},${t.status}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paper_trading_ledger_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${PaperTradingState.trades.length} paper trades to CSV`, 'success');
}

// ==========================================================================
// Feature 1: Multi-Asset Market Screener & Watchlist
// ==========================================================================

export const SCREENER_SYMBOLS = [
    { symbol: '1HZ10V', name: 'Vol 10 (1s)', pipSize: 2, step: 0.35, basePrice: 1250 },
    { symbol: '1HZ25V', name: 'Vol 25 (1s)', pipSize: 2, step: 0.45, basePrice: 2480 },
    { symbol: '1HZ50V', name: 'Vol 50 (1s)', pipSize: 4, step: 0.22, basePrice: 3820 },
    { symbol: '1HZ75V', name: 'Vol 75 (1s)', pipSize: 4, step: 0.32, basePrice: 4750 },
    { symbol: '1HZ100V', name: 'Vol 100 (1s)', pipSize: 2, step: 0.55, basePrice: 6200 }
];

export const ScreenerState = {
    assets: {},
    backgroundTimer: null
};

export function initScreener() {
    // 1. Initialize asset state with realistic seed history
    SCREENER_SYMBOLS.forEach(item => {
        let p = item.basePrice;
        const sparks = [];
        for (let i = 0; i < 8; i++) {
            p += (Math.random() - 0.5) * item.step;
            if (p < 1) p = 10;
            sparks.push(extractDigit(p, item.pipSize));
        }
        const lastDigit = sparks[sparks.length - 1];
        const isEven = lastDigit % 2 === 0;

        // Calculate seed streak
        let streak = 0;
        const targetParity = isEven;
        for (let i = sparks.length - 1; i >= 0; i--) {
            if ((sparks[i] % 2 === 0) === targetParity) streak++;
            else break;
        }

        const evens = sparks.filter(d => d % 2 === 0).length;
        const topSignal = evens >= 4 ? 'EVEN' : 'ODD';
        const confidence = Math.min(88, Math.max(58, Math.round(55 + Math.random() * 25)));

        ScreenerState.assets[item.symbol] = {
            symbol: item.symbol,
            name: item.name,
            pipSize: item.pipSize,
            step: item.step,
            price: p,
            lastDigit,
            streak,
            streakType: isEven ? 'EVEN' : 'ODD',
            sparkDigits: sparks,
            topSignal,
            confidence
        };
    });

    // 2. Render initial grid
    renderScreenerGrid();

    // 3. Toggle button listener
    const toggleBtn = document.getElementById('open-screener-btn');
    const screenerSection = document.getElementById('screener-section');
    if (toggleBtn && screenerSection) {
        toggleBtn.classList.add('active');
        toggleBtn.addEventListener('click', () => {
            const isHidden = screenerSection.style.display === 'none';
            screenerSection.style.display = isHidden ? '' : 'none';
            toggleBtn.classList.toggle('active', isHidden);
        });
    }

    // 4. Background simulation loop (updates background watchlist assets every 1400ms)
    if (ScreenerState.backgroundTimer) clearInterval(ScreenerState.backgroundTimer);
    ScreenerState.backgroundTimer = setInterval(() => {
        if (typeof document !== 'undefined' && document.hidden) return; // Skip when tab hidden

        SCREENER_SYMBOLS.forEach(item => {
            // Background update only symbols that aren't the primary live active symbol
            if (item.symbol !== AppState.currentSymbol) {
                simulateBackgroundScreenerTick(item.symbol);
            }
        });
    }, 1400);
}

function simulateBackgroundScreenerTick(symbol) {
    const asset = ScreenerState.assets[symbol];
    if (!asset) return;

    asset.price += (Math.random() - 0.5) * asset.step;
    if (asset.price < 1) asset.price = 10;
    const digit = extractDigit(asset.price, asset.pipSize);

    updateAssetMetrics(asset, digit);
    updateScreenerTileDOM(symbol);
}

export function updateScreenerLiveAsset(symbol, price, digit) {
    const asset = ScreenerState.assets[symbol];
    if (!asset) return;

    asset.price = price;
    updateAssetMetrics(asset, digit);
    updateScreenerTileDOM(symbol);
}

function updateAssetMetrics(asset, digit) {
    asset.lastDigit = digit;
    const isEven = digit % 2 === 0;

    if (asset.streakType === (isEven ? 'EVEN' : 'ODD')) {
        asset.streak++;
    } else {
        asset.streak = 1;
        asset.streakType = isEven ? 'EVEN' : 'ODD';
    }

    asset.sparkDigits.push(digit);
    if (asset.sparkDigits.length > 8) asset.sparkDigits.shift();

    const evens = asset.sparkDigits.filter(d => d % 2 === 0).length;
    const odds = asset.sparkDigits.length - evens;
    if (asset.streak >= 4) {
        // High streak exhaustion counter-reversal signal
        asset.topSignal = asset.streakType === 'EVEN' ? 'ODD' : 'EVEN';
        asset.confidence = Math.min(88, 60 + asset.streak * 4);
    } else {
        asset.topSignal = evens >= odds ? 'EVEN' : 'ODD';
        asset.confidence = Math.min(84, Math.max(55, Math.round((Math.max(evens, odds) / asset.sparkDigits.length) * 100)));
    }
}

export function renderScreenerGrid() {
    const grid = document.getElementById('screener-grid');
    if (!grid) return;

    grid.innerHTML = '';
    SCREENER_SYMBOLS.forEach(item => {
        const asset = ScreenerState.assets[item.symbol];
        if (!asset) return;

        const tile = document.createElement('div');
        tile.className = `screener-tile ${asset.symbol === AppState.currentSymbol ? 'active' : ''}`;
        tile.id = `screener-tile-${asset.symbol}`;
        tile.title = `Click to switch to ${asset.name}`;

        tile.innerHTML = generateScreenerTileHTML(asset);

        tile.addEventListener('click', () => {
            switchMarketAsset(asset.symbol);
        });

        grid.appendChild(tile);
    });
}

function generateScreenerTileHTML(asset) {
    const isEven = asset.lastDigit % 2 === 0;
    const sparksHtml = asset.sparkDigits.map(d =>
        `<span class="screener-spark-dot ${d % 2 === 0 ? 'even' : 'odd'}" title="Digit ${d}"></span>`
    ).join('');

    return `
        <div class="screener-tile-top">
            <span class="screener-symbol">${asset.name}</span>
            <span class="screener-streak-badge ${asset.streak >= 3 ? 'badge-hot' : ''}" id="screener-streak-${asset.symbol}">
                ${asset.streak} ${asset.streakType}
            </span>
        </div>
        <div class="screener-tile-body">
            <span class="screener-price" id="screener-price-${asset.symbol}">${asset.price.toFixed(asset.pipSize)}</span>
            <span class="screener-digit-pill ${isEven ? 'even' : 'odd'}" id="screener-pill-${asset.symbol}">
                ${asset.lastDigit}
            </span>
        </div>
        <div class="screener-signal-row">
            <span>Signal:</span>
            <span class="screener-signal-badge" id="screener-signal-${asset.symbol}">
                ${asset.topSignal} ${asset.confidence}%
            </span>
        </div>
        <div class="screener-sparks" id="screener-sparks-${asset.symbol}">
            ${sparksHtml}
        </div>
    `;
}

function updateScreenerTileDOM(symbol) {
    const asset = ScreenerState.assets[symbol];
    if (!asset) return;

    const priceEl = document.getElementById(`screener-price-${symbol}`);
    const pillEl = document.getElementById(`screener-pill-${symbol}`);
    const streakEl = document.getElementById(`screener-streak-${symbol}`);
    const signalEl = document.getElementById(`screener-signal-${symbol}`);
    const sparksEl = document.getElementById(`screener-sparks-${symbol}`);

    if (!priceEl || !pillEl) {
        renderScreenerGrid();
        return;
    }

    priceEl.innerText = asset.price.toFixed(asset.pipSize);

    const isEven = asset.lastDigit % 2 === 0;
    pillEl.className = `screener-digit-pill ${isEven ? 'even' : 'odd'}`;
    pillEl.innerText = asset.lastDigit.toString();

    if (streakEl) {
        streakEl.innerText = `${asset.streak} ${asset.streakType}`;
        streakEl.className = `screener-streak-badge ${asset.streak >= 3 ? 'badge-hot' : ''}`;
    }

    if (signalEl) {
        signalEl.innerText = `${asset.topSignal} ${asset.confidence}%`;
    }

    if (sparksEl) {
        sparksEl.innerHTML = asset.sparkDigits.map(d =>
            `<span class="screener-spark-dot ${d % 2 === 0 ? 'even' : 'odd'}" title="Digit ${d}"></span>`
        ).join('');
    }
}

export function updateScreenerActiveHighlight(symbol) {
    document.querySelectorAll('.screener-tile').forEach(t => t.classList.remove('active'));
    const activeTile = document.getElementById(`screener-tile-${symbol}`);
    if (activeTile) activeTile.classList.add('active');
}

export function switchMarketAsset(symbol) {
    const assetSelect = document.getElementById('asset-select');
    if (assetSelect) {
        assetSelect.value = symbol;
        assetSelect.dispatchEvent(new Event('change'));
    }
    updateScreenerActiveHighlight(symbol);
    showToast(`Switched active market to ${symbol}`, 'info');
}

// ==========================================================================
// Feature 2: Strategy Backtesting Simulation Engine
// ==========================================================================

export const BacktestState = {
    chart: null,
    lastResults: null
};

export function initBacktester() {
    const dialog = document.getElementById('backtest-dialog');
    const openBtn = document.getElementById('open-backtest-btn');
    const closeBtn = document.getElementById('close-backtest-btn');
    const runBtn = document.getElementById('run-backtest-btn');
    const stratSelect = document.getElementById('bt-strategy-select');
    const barrierGroup = document.getElementById('bt-barrier-group');

    if (!dialog) return;

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            dialog.showModal();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            dialog.close();
        });
    }

    // Modern Web: Light dismiss on native dialog backdrop click
    dialog.addEventListener('click', (e) => {
        const rect = dialog.getBoundingClientRect();
        const isInDialog = (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
        );
        if (!isInDialog) dialog.close();
    });

    // Reveal barrier input dynamically if Over/Under is selected
    if (stratSelect && barrierGroup) {
        stratSelect.addEventListener('change', () => {
            barrierGroup.style.display = stratSelect.value === 'over_under' ? 'block' : 'none';
        });
    }

    if (runBtn) {
        runBtn.addEventListener('click', () => {
            runBacktestSimulation();
        });
    }
}

export function runBacktestSimulation() {
    const sampleSize = parseInt(document.getElementById('bt-sample-select')?.value || '500', 10);
    const strategy = document.getElementById('bt-strategy-select')?.value || 'even_odd';
    const barrier = parseInt(document.getElementById('bt-barrier-input')?.value || '5', 10);
    const stakingPlan = document.getElementById('bt-staking-select')?.value || 'flat';
    const baseStake = Math.max(1, parseFloat(document.getElementById('bt-stake-input')?.value || '10'));
    const minConf = parseFloat(document.getElementById('bt-conf-input')?.value || '65');
    const tp = parseFloat(document.getElementById('bt-tp-input')?.value || '150');
    const sl = parseFloat(document.getElementById('bt-sl-input')?.value || '100');

    // Retrieve or synthesize historical tick sequence
    let ticks = AppState.ticks ? [...AppState.ticks] : [];
    if (ticks.length < sampleSize) {
        const needed = sampleSize - ticks.length;
        const base = AppState.feedManager?.syntheticProvider?.baselineFor(AppState.currentSymbol) || { price: 1000, pipSize: 2, step: 0.35 };
        let p = (ticks.length > 0 ? ticks[0].price : base.price);
        const synthHistorical = [];
        const now = Math.floor(Date.now() / 1000);
        for (let i = needed; i > 0; i--) {
            p += (Math.random() - 0.5) * base.step;
            if (p < 1) p = 10;
            const digit = extractDigit(p, base.pipSize);
            synthHistorical.push({ price: Number(p.toFixed(base.pipSize)), digit, time: now - i * 2 });
        }
        ticks = [...synthHistorical, ...ticks];
    }
    const sampleTicks = ticks.slice(-sampleSize);

    // Sequential tick-by-tick quantitative backtesting
    let simBalance = 10000;
    let peakBalance = 10000;
    let maxDrawdown = 0;
    let maxDrawdownPct = 0;
    let wins = 0;
    let losses = 0;
    let grossProfit = 0;
    let grossLoss = 0;
    let currentLossStreak = 0;
    let maxLossStreak = 0;
    let currentStake = baseStake;

    const equityCurve = [simBalance];
    const equityLabels = ['Start'];
    const tradeLog = [];

    const minLookback = 15;
    for (let i = minLookback; i < sampleTicks.length - 1; i++) {
        const historySlice = sampleTicks.slice(0, i + 1);
        const nextTick = sampleTicks[i + 1];

        const pred = evaluateStrategyPrediction(strategy, historySlice, barrier);
        if (!pred || !pred.valid || pred.confidence < minConf) {
            continue;
        }

        let isWin = false;
        let payoutRate = 0.95;
        let signalLabel = pred.outcome;

        if (strategy === 'even_odd') {
            const isEven = nextTick.digit % 2 === 0;
            isWin = (pred.outcome === 'EVEN' && isEven) || (pred.outcome === 'ODD' && !isEven);
            payoutRate = 0.95;
            signalLabel = pred.outcome;
        } else if (strategy === 'over_under') {
            const isOver = nextTick.digit > barrier;
            const isUnder = nextTick.digit < barrier;
            isWin = (pred.outcome === 'OVER' && isOver) || (pred.outcome === 'UNDER' && isUnder);
            const payoutInfo = calculateContractPayout(pred.outcome, barrier);
            payoutRate = payoutInfo.rate;
            signalLabel = `${pred.outcome} ${barrier}`;
        } else if (strategy === 'matches') {
            isWin = (nextTick.digit === pred.target);
            payoutRate = 8.00;
            signalLabel = `MATCH ${pred.target}`;
        }

        const stake = Math.min(currentStake, simBalance * 0.5);
        if (stake <= 0) break;

        let pnl = 0;
        if (isWin) {
            pnl = stake * payoutRate;
            simBalance += pnl;
            grossProfit += pnl;
            wins++;
            currentLossStreak = 0;

            if (stakingPlan === 'martingale') {
                currentStake = baseStake;
            } else if (stakingPlan === 'dalembert') {
                currentStake = Math.max(baseStake, currentStake - baseStake);
            }
        } else {
            pnl = -stake;
            simBalance += pnl;
            grossLoss += stake;
            losses++;
            currentLossStreak++;
            if (currentLossStreak > maxLossStreak) maxLossStreak = currentLossStreak;

            if (stakingPlan === 'martingale') {
                currentStake = currentStake * 2.0;
            } else if (stakingPlan === 'dalembert') {
                currentStake = currentStake + baseStake;
            }
        }

        // Drawdown tracking
        if (simBalance > peakBalance) peakBalance = simBalance;
        const currentDD = peakBalance - simBalance;
        if (currentDD > maxDrawdown) maxDrawdown = currentDD;
        const currentDDPct = peakBalance > 0 ? (currentDD / peakBalance) * 100 : 0;
        if (currentDDPct > maxDrawdownPct) maxDrawdownPct = currentDDPct;

        equityCurve.push(Number(simBalance.toFixed(2)));
        equityLabels.push(`#${equityCurve.length - 1}`);

        tradeLog.push({
            id: tradeLog.length + 1,
            strategy: strategy === 'even_odd' ? 'Even/Odd' : (strategy === 'over_under' ? 'Over/Under' : 'Matches'),
            signal: signalLabel,
            stake: stake,
            exitDigit: nextTick.digit,
            isWin,
            pnl,
            simBalance: simBalance
        });

        // Take Profit / Stop Loss check
        const netPnl = simBalance - 10000;
        if (netPnl >= tp || netPnl <= -sl) {
            break;
        }
    }

    // Compute Metrics
    const totalTrades = wins + losses;
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
    const netPnl = simBalance - 10000;
    const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss) : (grossProfit > 0 ? 99.99 : 0);

    // Update KPI UI
    const kpiTrades = document.getElementById('bt-kpi-trades');
    const kpiWinrate = document.getElementById('bt-kpi-winrate');
    const kpiPnl = document.getElementById('bt-kpi-pnl');
    const kpiPf = document.getElementById('bt-kpi-pf');
    const kpiMdd = document.getElementById('bt-kpi-mdd');
    const kpiStreak = document.getElementById('bt-kpi-streak');

    if (kpiTrades) kpiTrades.innerText = totalTrades.toString();
    if (kpiWinrate) {
        kpiWinrate.innerText = `${winRate.toFixed(1)}%`;
        kpiWinrate.className = `kpi-value ${winRate >= 50 ? 'green' : 'red'}`;
    }
    if (kpiPnl) {
        const prefix = netPnl >= 0 ? '+$' : '-$';
        kpiPnl.innerText = `${prefix}${Math.abs(netPnl).toFixed(2)}`;
        kpiPnl.className = `kpi-value ${netPnl >= 0 ? 'green' : 'red'}`;
    }
    if (kpiPf) {
        kpiPf.innerText = profitFactor >= 99.99 ? 'MAX' : profitFactor.toFixed(2);
        kpiPf.className = `kpi-value ${profitFactor >= 1.2 ? 'green' : (profitFactor < 1.0 ? 'red' : '')}`;
    }
    if (kpiMdd) {
        kpiMdd.innerText = `-$${maxDrawdown.toFixed(2)} (${maxDrawdownPct.toFixed(1)}%)`;
    }
    if (kpiStreak) {
        kpiStreak.innerText = maxLossStreak.toString();
    }

    // Render Equity Curve Chart
    renderBacktestChart(equityCurve, equityLabels, netPnl >= 0);

    // Render Simulated Trades Table
    renderBacktestTradeTable(tradeLog);

    showToast(`Simulation completed: ${totalTrades} trades simulated`, netPnl >= 0 ? 'success' : 'info');
}

function renderBacktestChart(equityData, labels, isProfitable) {
    const canvas = document.getElementById('backtestChart');
    if (!canvas || typeof Chart === 'undefined') return;

    if (BacktestState.chart) {
        BacktestState.chart.destroy();
    }

    const ctx = canvas.getContext('2d');
    const colors = getThemeColors();
    const lineColor = isProfitable ? '#10b981' : '#ef4444';

    const gradient = ctx.createLinearGradient(0, 0, 0, 180);
    gradient.addColorStop(0, isProfitable ? 'rgba(16, 185, 129, 0.28)' : 'rgba(239, 68, 68, 0.28)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    BacktestState.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Simulated Equity ($)',
                data: equityData,
                borderColor: lineColor,
                borderWidth: 2,
                pointRadius: equityData.length > 50 ? 0 : 2.5,
                pointBackgroundColor: lineColor,
                pointBorderColor: colors.pointBorder,
                tension: 0.2,
                fill: true,
                backgroundColor: gradient
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 400 },
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: colors.tooltipBg,
                    titleColor: colors.tickColor,
                    bodyColor: colors.tooltipText,
                    callbacks: {
                        label: (c) => `Sim Balance: $${c.parsed.y.toFixed(2)}`
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        color: colors.tickColor,
                        font: { size: 10 },
                        maxTicksLimit: 8
                    }
                },
                y: {
                    grid: { color: colors.gridColor },
                    ticks: {
                        color: colors.tickColor,
                        font: { size: 10 },
                        callback: (v) => `$${v.toLocaleString()}`
                    }
                }
            }
        }
    });
}

function renderBacktestTradeTable(trades) {
    const tbody = document.getElementById('bt-trade-tbody');
    if (!tbody) return;

    if (!trades || trades.length === 0) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="7">No trades executed with current minimum confidence filter.</td></tr>`;
        return;
    }

    const recent = trades.slice(-30).reverse();
    tbody.innerHTML = recent.map(t => `
        <tr>
            <td style="font-weight:600; color:var(--text-dim);">#${t.id}</td>
            <td>${t.strategy}</td>
            <td><strong style="color:var(--text-main);">${t.signal}</strong></td>
            <td>$${t.stake.toFixed(2)}</td>
            <td><span class="badge ${t.exitDigit % 2 === 0 ? 'badge-even' : 'badge-odd'}">${t.exitDigit}</span></td>
            <td>
                <span class="badge ${t.isWin ? 'badge-even' : 'badge-odd'}" style="background:${t.isWin ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}; color:${t.isWin ? '#10b981' : '#ef4444'};">
                    ${t.isWin ? 'WIN' : 'LOSS'} (${t.pnl >= 0 ? '+$' : '-$'}${Math.abs(t.pnl).toFixed(2)})
                </span>
            </td>
            <td style="font-weight:700; font-variant-numeric:tabular-nums; color:${t.simBalance >= 10000 ? '#10b981' : '#ef4444'};">
                $${t.simBalance.toFixed(2)}
            </td>
        </tr>
    `).join('');
}

// ==========================================================================
// Feature 5: Bot Presets & Session Vault
// ==========================================================================

export const SYSTEM_PRESETS = [
    {
        id: 'conservative_parity',
        name: 'Conservative Parity Scalper',
        badge: 'LOW RISK',
        desc: 'Low-risk, disciplined scalping waiting for high statistical divergence in digit parity with flat staking.',
        strategy: 'even_odd',
        stakingPlan: 'flat',
        baseStake: 10,
        minConfidence: 70,
        takeProfit: 50,
        stopLoss: 50,
        barrier: 5
    },
    {
        id: 'martingale_streak',
        name: 'Martingale Streak Hunter',
        badge: 'AGGRESSIVE',
        desc: 'Aggressive recovery model capitalizing on rapid parity mean-reversion streaks with 2.0x Martingale progression.',
        strategy: 'even_odd',
        stakingPlan: 'martingale',
        baseStake: 5,
        minConfidence: 60,
        takeProfit: 100,
        stopLoss: 150,
        barrier: 5
    },
    {
        id: 'barrier_under_exploiter',
        name: 'Barrier 7 Under Exploiter',
        badge: 'ASYMMETRIC',
        desc: 'High-probability asymmetric edge targeting Under 7 (70% base chance) with gentle D\'Alembert stake adjustments.',
        strategy: 'over_under',
        stakingPlan: 'dalembert',
        baseStake: 10,
        minConfidence: 65,
        takeProfit: 120,
        stopLoss: 80,
        barrier: 7
    },
    {
        id: 'cluster_outlier_matches',
        name: 'Cluster Outlier (Matches)',
        badge: 'HIGH PAYOUT',
        desc: 'High-payout (800%+) statistical anomaly hunter targeting Poisson clustering after extended digit dormancy.',
        strategy: 'matches',
        stakingPlan: 'flat',
        baseStake: 5,
        minConfidence: 75,
        takeProfit: 250,
        stopLoss: 100,
        barrier: 5
    }
];

export function initVault() {
    const dialog = document.getElementById('vault-dialog');
    const openBtn = document.getElementById('open-vault-btn');
    const closeBtn = document.getElementById('close-vault-btn');
    const savePresetBtn = document.getElementById('save-current-preset-btn');
    const exportBtn = document.getElementById('vault-export-btn');
    const importBtn = document.getElementById('vault-import-btn');
    const importInput = document.getElementById('vault-import-input');

    if (!dialog) return;

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            renderSystemPresets();
            renderCustomPresets();
            dialog.showModal();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            dialog.close();
        });
    }

    // Modern Web: Light dismiss on backdrop click
    dialog.addEventListener('click', (e) => {
        const rect = dialog.getBoundingClientRect();
        const isInDialog = (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
        );
        if (!isInDialog) dialog.close();
    });

    // Save custom preset
    if (savePresetBtn) {
        savePresetBtn.addEventListener('click', () => {
            const nameInput = document.getElementById('custom-preset-name');
            const name = nameInput ? nameInput.value.trim() : '';
            if (!name) {
                showToast('Please enter a name for your preset', 'error');
                return;
            }

            const customPreset = {
                id: `custom_${Date.now()}`,
                name: name,
                created: Date.now(),
                strategy: AppState.activeStrategy,
                stakingPlan: PaperTradingState.bot.stakingPlan,
                baseStake: PaperTradingState.defaultStake,
                minConfidence: PaperTradingState.bot.minConfidence,
                takeProfit: PaperTradingState.bot.takeProfit,
                stopLoss: PaperTradingState.bot.stopLoss,
                barrier: AppState.barrier
            };

            const presets = getCustomPresets();
            presets.unshift(customPreset);
            saveCustomPresets(presets);
            renderCustomPresets();
            if (nameInput) nameInput.value = '';
            showToast(`Preset "${name}" saved to Vault!`, 'success');
        });
    }

    // Export vault JSON
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            exportSessionVault();
        });
    }

    // Import vault JSON
    if (importBtn && importInput) {
        importBtn.addEventListener('click', () => {
            importInput.click();
        });

        importInput.addEventListener('change', (e) => {
            const file = e.target.files ? e.target.files[0] : null;
            if (file) {
                importSessionVault(file);
                importInput.value = ''; // Reset input
            }
        });
    }
}

function renderSystemPresets() {
    const grid = document.getElementById('system-presets-grid');
    if (!grid) return;

    grid.innerHTML = SYSTEM_PRESETS.map(p => `
        <div class="preset-card">
            <div class="preset-card-title">
                <span>${p.name}</span>
                <span class="preset-badge">${p.badge}</span>
            </div>
            <div class="preset-card-desc">${p.desc}</div>
            <div class="preset-card-meta">
                <div><strong>Strategy:</strong> ${p.strategy === 'even_odd' ? 'Even / Odd' : (p.strategy === 'over_under' ? 'Over / Under (Barrier ' + p.barrier + ')' : 'Matches / Differs')}</div>
                <div><strong>Staking:</strong> ${p.stakingPlan.toUpperCase()} ($${p.baseStake} base) | <strong>Min Conf:</strong> ${p.minConfidence}%</div>
                <div><strong>TP / SL:</strong> +$${p.takeProfit} / -$${p.stopLoss}</div>
            </div>
            <button type="button" class="btn-preset-load" data-preset-id="${p.id}">
                <i class="fa-solid fa-play"></i> Apply Profile
            </button>
        </div>
    `).join('');

    grid.querySelectorAll('.btn-preset-load').forEach(btn => {
        btn.addEventListener('click', () => {
            const presetId = btn.dataset.presetId;
            const preset = SYSTEM_PRESETS.find(x => x.id === presetId);
            if (preset) applyPreset(preset);
        });
    });
}

function getCustomPresets() {
    try {
        const stored = localStorage.getItem('tradingpool_presets');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

function saveCustomPresets(presets) {
    try {
        localStorage.setItem('tradingpool_presets', JSON.stringify(presets));
    } catch (e) {}
}

function renderCustomPresets() {
    const grid = document.getElementById('custom-presets-grid');
    if (!grid) return;

    const presets = getCustomPresets();
    if (presets.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1 / -1; color: var(--text-dim); font-size: 0.8rem; text-align: center; padding: 16px; background: rgba(0,0,0,0.15); border-radius: var(--radius-sm);">No custom presets saved yet. Configure your bot parameters and click "Save Current Config" above.</div>`;
        return;
    }

    grid.innerHTML = presets.map((p, idx) => `
        <div class="preset-card">
            <div class="preset-card-title">
                <span>${p.name}</span>
                <button type="button" class="btn-delete-preset" data-index="${idx}" title="Delete preset" style="background:none; border:none; color:var(--text-dim); cursor:pointer; font-size:0.85rem;">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
            <div class="preset-card-desc" style="font-size:0.75rem;">Saved: ${new Date(p.created || Date.now()).toLocaleDateString()}</div>
            <div class="preset-card-meta">
                <div><strong>Strategy:</strong> ${p.strategy === 'even_odd' ? 'Even / Odd' : (p.strategy === 'over_under' ? 'Over / Under (Barrier ' + p.barrier + ')' : 'Matches / Differs')}</div>
                <div><strong>Staking:</strong> ${p.stakingPlan.toUpperCase()} ($${p.baseStake} base) | <strong>Min Conf:</strong> ${p.minConfidence}%</div>
                <div><strong>TP / SL:</strong> +$${p.takeProfit} / -$${p.stopLoss}</div>
            </div>
            <button type="button" class="btn-preset-load" data-custom-idx="${idx}">
                <i class="fa-solid fa-play"></i> Apply Preset
            </button>
        </div>
    `).join('');

    grid.querySelectorAll('.btn-preset-load').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.customIdx, 10);
            const p = presets[idx];
            if (p) applyPreset(p);
        });
    });

    grid.querySelectorAll('.btn-delete-preset').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index, 10);
            if (confirm(`Delete preset "${presets[idx].name}"?`)) {
                presets.splice(idx, 1);
                saveCustomPresets(presets);
                renderCustomPresets();
                showToast('Preset deleted', 'info');
            }
        });
    });
}

export function applyPreset(p) {
    AppState.activeStrategy = p.strategy;
    if (p.barrier !== undefined) AppState.barrier = p.barrier;

    const stratSelect = document.getElementById('strategy-select');
    if (stratSelect) stratSelect.value = p.strategy;

    const paperStratSelect = document.getElementById('paper-strategy-select');
    if (paperStratSelect) {
        paperStratSelect.value = p.strategy;
        paperStratSelect.dispatchEvent(new Event('change'));
    }

    const barrierInput = document.getElementById('barrier-input');
    if (barrierInput) barrierInput.value = p.barrier || 5;

    const paperBarrierInput = document.getElementById('paper-barrier-input');
    if (paperBarrierInput) paperBarrierInput.value = p.barrier || 5;

    PaperTradingState.defaultStake = p.baseStake;
    PaperTradingState.bot.stakingPlan = p.stakingPlan;
    PaperTradingState.bot.minConfidence = p.minConfidence;
    PaperTradingState.bot.takeProfit = p.takeProfit;
    PaperTradingState.bot.stopLoss = p.stopLoss;

    const stakeInput = document.getElementById('paper-stake-input');
    if (stakeInput) stakeInput.value = p.baseStake;

    const stakingPlanSelect = document.getElementById('bot-staking-plan');
    if (stakingPlanSelect) stakingPlanSelect.value = p.stakingPlan;

    const minConfSlider = document.getElementById('bot-min-conf-slider');
    const minConfVal = document.getElementById('bot-min-conf-val');
    if (minConfSlider) minConfSlider.value = p.minConfidence;
    if (minConfVal) minConfVal.innerText = `${p.minConfidence}%`;

    const tpInput = document.getElementById('bot-tp-input');
    if (tpInput) tpInput.value = p.takeProfit;

    const slInput = document.getElementById('bot-sl-input');
    if (slInput) slInput.value = p.stopLoss;

    // Sync to backtest dialog controls
    const btStrat = document.getElementById('bt-strategy-select');
    if (btStrat) {
        btStrat.value = p.strategy;
        btStrat.dispatchEvent(new Event('change'));
    }
    const btStaking = document.getElementById('bt-staking-select');
    if (btStaking) btStaking.value = p.stakingPlan;
    const btStake = document.getElementById('bt-stake-input');
    if (btStake) btStake.value = p.baseStake;
    const btConf = document.getElementById('bt-conf-input');
    if (btConf) btConf.value = p.minConfidence;
    const btTp = document.getElementById('bt-tp-input');
    if (btTp) btTp.value = p.takeProfit;
    const btSl = document.getElementById('bt-sl-input');
    if (btSl) btSl.value = p.stopLoss;
    const btBarrier = document.getElementById('bt-barrier-input');
    if (btBarrier) btBarrier.value = p.barrier || 5;

    savePaperTradingData();
    updatePayoutEstimate();

    const vaultDialog = document.getElementById('vault-dialog');
    if (vaultDialog && vaultDialog.open) vaultDialog.close();

    showToast(`Bot profile applied: "${p.name}"`, 'success');
}

export function exportSessionVault() {
    try {
        const vaultData = {
            version: '2.0.0',
            exportedAt: new Date().toISOString(),
            currentSymbol: AppState.currentSymbol,
            paperTrading: {
                balance: PaperTradingState.balance,
                initialBalance: PaperTradingState.initialBalance,
                defaultStake: PaperTradingState.defaultStake,
                durationTicks: PaperTradingState.durationTicks,
                bot: { ...PaperTradingState.bot },
                trades: PaperTradingState.trades
            },
            customPresets: getCustomPresets(),
            recentTicksSample: AppState.ticks.slice(-100)
        };

        const jsonStr = JSON.stringify(vaultData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const filename = `tradingpool_vault_${AppState.currentSymbol}_${new Date().toISOString().slice(0, 10)}.json`;
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('Session Vault exported successfully', 'success');
    } catch (e) {
        showToast('Failed to export Session Vault', 'error');
    }
}

export function importSessionVault(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (!data.paperTrading && data.balance === undefined) {
                showToast('Invalid vault file format', 'error');
                return;
            }

            if (!confirm('Import this session vault? This will restore your balance, trades, and presets.')) {
                return;
            }

            // Restore Paper Trading State
            if (data.paperTrading) {
                if (data.paperTrading.balance !== undefined) PaperTradingState.balance = data.paperTrading.balance;
                if (data.paperTrading.trades) PaperTradingState.trades = data.paperTrading.trades;
                if (data.paperTrading.defaultStake) PaperTradingState.defaultStake = data.paperTrading.defaultStake;
                if (data.paperTrading.durationTicks) PaperTradingState.durationTicks = data.paperTrading.durationTicks;
                if (data.paperTrading.bot) PaperTradingState.bot = { ...PaperTradingState.bot, ...data.paperTrading.bot };
            } else if (data.balance !== undefined) {
                PaperTradingState.balance = data.balance;
                if (data.trades) PaperTradingState.trades = data.trades;
            }

            // Restore Custom Presets
            if (Array.isArray(data.customPresets)) {
                saveCustomPresets(data.customPresets);
            }

            // Restore Symbol
            if (data.currentSymbol) {
                switchMarketAsset(data.currentSymbol);
            }

            // Save to localStorage
            savePaperTradingData();

            // Refresh UI
            updatePaperKPIs();
            renderTradeHistoryTable();
            renderCustomPresets();

            const stakeInput = document.getElementById('paper-stake-input');
            if (stakeInput) stakeInput.value = PaperTradingState.defaultStake;

            const tpInput = document.getElementById('bot-tp-input');
            if (tpInput) tpInput.value = PaperTradingState.bot.takeProfit;

            const slInput = document.getElementById('bot-sl-input');
            if (slInput) slInput.value = PaperTradingState.bot.stopLoss;

            const minConfSlider = document.getElementById('bot-min-conf-slider');
            const minConfVal = document.getElementById('bot-min-conf-val');
            if (minConfSlider) minConfSlider.value = PaperTradingState.bot.minConfidence;
            if (minConfVal) minConfVal.innerText = `${PaperTradingState.bot.minConfidence}%`;

            const stakingPlan = document.getElementById('bot-staking-plan');
            if (stakingPlan) stakingPlan.value = PaperTradingState.bot.stakingPlan;

            showToast('Session Vault imported and applied!', 'success');

            const vaultDialog = document.getElementById('vault-dialog');
            if (vaultDialog && vaultDialog.open) vaultDialog.close();
        } catch (err) {
            showToast('Failed to parse vault file', 'error');
        }
    };
    reader.readAsText(file);
}

// --- DOM Event Initialization ---
function initApp() {
    // 0. Multi-Theme & Internationalization Setup (Always run first!)
    initTheme();
    initLanguage();

    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.value = activeTheme;
        themeSelect.addEventListener('change', (e) => {
            setTheme(e.target.value);
            showToast(`Theme: ${e.target.options[e.target.selectedIndex].text}`, 'info');
        });
    }

    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.value = activeLanguage;
        langSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
            showToast(`Language: ${e.target.options[e.target.selectedIndex].text}`, 'info');
        });
    }

    // Custom dropdown support if present
    const themeBtn = document.getElementById('theme-btn');
    const themeMenu = document.getElementById('theme-menu');
    const langBtn = document.getElementById('lang-btn');
    const langMenu = document.getElementById('lang-menu');

    if (themeBtn && themeMenu) {
        themeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (langMenu) langMenu.classList.remove('show');
            themeMenu.classList.toggle('show');
        });

        document.querySelectorAll('.theme-opt-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                setTheme(btn.dataset.theme);
                themeMenu.classList.remove('show');
                showToast(`Visual Theme: ${btn.innerText.trim()}`, 'info');
            });
        });
    }

    if (langBtn && langMenu) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (themeMenu) themeMenu.classList.remove('show');
            langMenu.classList.toggle('show');
        });

        document.querySelectorAll('.lang-opt-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                setLanguage(btn.dataset.lang);
                langMenu.classList.remove('show');
                showToast(`Language: ${btn.innerText.trim()}`, 'info');
            });
        });
    }

    document.addEventListener('click', () => {
        if (themeMenu) themeMenu.classList.remove('show');
        if (langMenu) langMenu.classList.remove('show');
    });

    window.addEventListener('languageChanged', () => {
        renderManualOrderButtons();
        if (AppState.feedManager) AppState.feedManager.updateFeedModeUI();
        updateBotUI();
        if (langSelect) langSelect.value = activeLanguage;
    });

    // 1. Populate Market Asset Select
    const assetSelect = document.getElementById('asset-select');
    const tradeLink = document.getElementById('trade-here-link');

    if (assetSelect) {
        assetSelect.innerHTML = '';
        MARKET_ASSETS.forEach(group => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = group.category;
            group.items.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item.symbol;
                opt.innerText = item.name;
                optgroup.appendChild(opt);
            });
            assetSelect.appendChild(optgroup);
        });

        const savedAsset = localStorage.getItem('tradingpool_asset');
        if (savedAsset) {
            AppState.currentSymbol = savedAsset;
            assetSelect.value = savedAsset;
        }

        const updateTradeBridge = (symbol) => {
            if (tradeLink) tradeLink.href = `https://app.deriv.com/dtrader?symbol=${symbol}`;
        };
        updateTradeBridge(AppState.currentSymbol);

        assetSelect.addEventListener('change', (e) => {
            AppState.currentSymbol = e.target.value;
            localStorage.setItem('tradingpool_asset', e.target.value);
            updateTradeBridge(AppState.currentSymbol);
            const titleEl = document.getElementById('chart-asset-name');
            if (titleEl) {
                const opt = assetSelect.options[assetSelect.selectedIndex];
                titleEl.innerText = opt ? opt.innerText : e.target.value;
            }
            if (AppState.feedManager) {
                AppState.feedManager.switchSymbol(AppState.currentSymbol);
            }
            updateScreenerActiveHighlight(AppState.currentSymbol);
        });
    }

    // 2. Strategy Selector & Barrier
    const strategySelect = document.getElementById('strategy-select');
    const targetDigitGroup = document.getElementById('target-digit-group');
    const targetDigitSelect = document.getElementById('target-digit-select');

    if (strategySelect) {
        const savedStrat = localStorage.getItem('tradingpool_strategy');
        if (savedStrat) {
            AppState.activeStrategy = savedStrat;
            strategySelect.value = savedStrat;
            if (savedStrat === 'over_under' && targetDigitGroup) targetDigitGroup.style.display = 'block';
        }

        strategySelect.addEventListener('change', (e) => {
            AppState.activeStrategy = e.target.value;
            localStorage.setItem('tradingpool_strategy', e.target.value);
            if (targetDigitGroup) {
                targetDigitGroup.style.display = e.target.value === 'over_under' ? 'block' : 'none';
            }
            updateLiveStrategyOutput();
            renderManualOrderButtons();
            updatePayoutEstimate();
        });
    }

    if (targetDigitSelect) {
        targetDigitSelect.addEventListener('change', (e) => {
            AppState.barrier = parseInt(e.target.value, 10);
            updateLiveStrategyOutput();
            renderManualOrderButtons();
            updatePayoutEstimate();
        });
    }

    // 3. Sample Window Filter Buttons (50, 100, 500, 1000)
    document.querySelectorAll('.btn-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            AppState.sampleWindow = parseInt(btn.dataset.window, 10);
            refreshDigitGrid();
            updateLiveStrategyOutput();
            showToast(`Analysis window set to last ${AppState.sampleWindow} ticks`, 'info');
        });
    });

    // 4. Audio Alert Toggle
    const soundBtn = document.getElementById('sound-btn');
    if (soundBtn) {
        const savedSound = localStorage.getItem('tradingpool_sound');
        if (savedSound !== null) {
            AppState.soundEnabled = savedSound === 'true';
            soundBtn.className = `sound-toggle-btn ${AppState.soundEnabled ? 'active' : ''}`;
        }
        soundBtn.addEventListener('click', () => {
            AppState.soundEnabled = !AppState.soundEnabled;
            localStorage.setItem('tradingpool_sound', AppState.soundEnabled);
            soundBtn.className = `sound-toggle-btn ${AppState.soundEnabled ? 'active' : ''}`;
            showToast(`Sound Alerts: ${AppState.soundEnabled ? 'ENABLED' : 'MUTED'}`, 'info');
            if (AppState.soundEnabled) playSignalChime(783.99);
        });
    }

    // 5. CSV Export Button
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            exportTicksToCSV();
        });
    }

    // 6. Markov Matrix Toggle
    const toggleMatrixBtn = document.getElementById('toggle-matrix-btn');
    const matrixContainer = document.getElementById('transition-matrix-container');
    if (toggleMatrixBtn && matrixContainer) {
        toggleMatrixBtn.addEventListener('click', () => {
            const isHidden = matrixContainer.style.display === 'none';
            matrixContainer.style.display = isHidden ? 'block' : 'none';
            toggleMatrixBtn.innerHTML = isHidden 
                ? `<i class="fa-solid fa-chevron-up"></i> <span data-i18n="hide_table">${t('hide_table')}</span>` 
                : `<i class="fa-solid fa-table-cells"></i> <span data-i18n="view_table">${t('view_table')}</span>`;
            if (isHidden) renderTransitionTable();
        });
    }

    // 7. Start / Pause Analysis
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const durationEl = document.getElementById('analysis-duration');

    if (startBtn && stopBtn) {
        startBtn.addEventListener('click', () => {
            if (!AppState.isAnalyzing) {
                AppState.isAnalyzing = true;
                AppState.startTime = Date.now();
                startBtn.style.opacity = '0.5';
                stopBtn.style.opacity = '1';
                showToast('Continuous Quantitative Analysis Started', 'info');

                if (AppState.timerInterval) clearInterval(AppState.timerInterval);
                AppState.timerInterval = setInterval(() => {
                    const elapsedSec = Math.floor((Date.now() - AppState.startTime) / 1000);
                    const m = Math.floor(elapsedSec / 60).toString().padStart(2, '0');
                    const s = (elapsedSec % 60).toString().padStart(2, '0');
                    if (durationEl) durationEl.innerText = `${m}:${s}`;
                }, 1000);

                updateLiveStrategyOutput();
            }
        });

        stopBtn.addEventListener('click', () => {
            AppState.isAnalyzing = false;
            startBtn.style.opacity = '1';
            stopBtn.style.opacity = '0.5';
            if (AppState.timerInterval) clearInterval(AppState.timerInterval);
            if (durationEl) durationEl.innerText = 'Paused';
            showToast('Analysis Paused', 'info');
        });
    }

    // 8. Predict Button
    const predictBtn = document.getElementById('predict-btn');
    if (predictBtn) {
        predictBtn.addEventListener('click', () => {
            runManualPrediction();
        });
    }

    // 9. Paper Trading Simulator UI Bindings
    loadPaperTradingData();
    updatePaperBalanceUI();
    updatePaperKPIs();
    renderManualOrderButtons();
    renderTradeHistoryTable();
    initEquityChart();

    // Mode Tabs (Manual Trade vs Auto-Trader Bot)
    const tabManualBtn = document.getElementById('tab-manual-btn');
    const tabBotBtn = document.getElementById('tab-bot-btn');
    const manualPane = document.getElementById('manual-pane');
    const botPane = document.getElementById('bot-pane');

    if (tabManualBtn && tabBotBtn && manualPane && botPane) {
        const switchTab = (mode) => {
            const isManual = mode === 'manual';
            tabManualBtn.classList.toggle('active', isManual);
            tabBotBtn.classList.toggle('active', !isManual);
            manualPane.style.display = isManual ? 'block' : 'none';
            botPane.style.display = isManual ? 'none' : 'block';
        };

        tabManualBtn.addEventListener('click', () => {
            if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                document.startViewTransition(() => switchTab('manual'));
            } else {
                switchTab('manual');
            }
        });

        tabBotBtn.addEventListener('click', () => {
            if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                document.startViewTransition(() => switchTab('bot'));
            } else {
                switchTab('bot');
            }
        });
    }

    // Stake Amount Input & Quick Pills
    const stakeInput = document.getElementById('paper-stake-input');
    if (stakeInput) {
        stakeInput.value = PaperTradingState.defaultStake;
        stakeInput.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            if (!isNaN(val) && val > 0) {
                PaperTradingState.defaultStake = val;
                savePaperTradingData();
                updatePayoutEstimate();
            }
        });
    }

    document.querySelectorAll('.btn-stake-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.btn-stake-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const stakeVal = parseFloat(pill.dataset.stake);
            if (stakeInput) stakeInput.value = stakeVal;
            PaperTradingState.defaultStake = stakeVal;
            savePaperTradingData();
            updatePayoutEstimate();
        });
    });

    // Duration in Ticks
    document.querySelectorAll('.btn-duration-pill').forEach(pill => {
        if (parseInt(pill.dataset.ticks, 10) === PaperTradingState.durationTicks) {
            document.querySelectorAll('.btn-duration-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
        }
        pill.addEventListener('click', () => {
            document.querySelectorAll('.btn-duration-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            PaperTradingState.durationTicks = parseInt(pill.dataset.ticks, 10);
            savePaperTradingData();
            showToast(`Settlement duration: ${PaperTradingState.durationTicks} tick${PaperTradingState.durationTicks > 1 ? 's' : ''}`, 'info');
        });
    });

    // 1-Click Bet Current Strategy Signal Button
    const betSignalBtn = document.getElementById('paper-bet-signal-btn');
    if (betSignalBtn) {
        betSignalBtn.addEventListener('click', () => {
            const windowTicks = getWindowTicks();
            const pred = evaluateStrategyPrediction(AppState.activeStrategy, windowTicks, AppState.barrier);
            if (!pred.valid) {
                showToast(pred.message || 'Waiting for valid signal...', 'error');
                return;
            }
            let target = null;
            if (AppState.activeStrategy === 'over_under') target = AppState.barrier;
            else if (AppState.activeStrategy === 'matches') {
                const dist = analyzeDigitDistribution(windowTicks);
                target = dist.maxOccurring;
            }
            executePaperTrade(pred.outcome, target);
        });
    }

    // Auto-Trader Bot Power Toggle & Controls
    const botToggle = document.getElementById('bot-power-toggle');
    const botConfSlider = document.getElementById('bot-min-confidence');
    const botConfVal = document.getElementById('bot-confidence-val');
    const botStakingSelect = document.getElementById('bot-staking-plan');
    const botTpInput = document.getElementById('bot-tp-input');
    const botSlInput = document.getElementById('bot-sl-input');

    if (botToggle) {
        botToggle.checked = PaperTradingState.bot.enabled;
        updateBotUI();
        botToggle.addEventListener('change', (e) => {
            PaperTradingState.bot.enabled = e.target.checked;
            updateBotUI();
            const termEl = document.getElementById('bot-status-terminal');
            if (e.target.checked) {
                if (termEl) termEl.innerHTML = `<i class="fa-solid fa-play" style="color:#10b981"></i> <span>Bot Active. Monitoring strategy signals...</span>`;
                showToast('Auto-Trader Bot: ENGAGED', 'success');
                playSignalChime(659.25, 'triangle');
            } else {
                if (termEl) termEl.innerHTML = `<i class="fa-solid fa-pause"></i> <span>Bot paused. Manual trading active.</span>`;
                showToast('Auto-Trader Bot: DISENGAGED', 'info');
            }
        });
    }

    if (botConfSlider && botConfVal) {
        botConfSlider.value = PaperTradingState.bot.minConfidence;
        botConfVal.innerText = `${PaperTradingState.bot.minConfidence}%`;
        botConfSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10);
            PaperTradingState.bot.minConfidence = val;
            botConfVal.innerText = `${val}%`;
            savePaperTradingData();
            updateBotUI();
        });
    }

    if (botStakingSelect) {
        botStakingSelect.value = PaperTradingState.bot.stakingPlan;
        botStakingSelect.addEventListener('change', (e) => {
            PaperTradingState.bot.stakingPlan = e.target.value;
            savePaperTradingData();
            showToast(`Staking plan set to: ${e.target.options[e.target.selectedIndex].text}`, 'info');
        });
    }

    if (botTpInput) {
        botTpInput.value = PaperTradingState.bot.takeProfit;
        botTpInput.addEventListener('change', (e) => {
            const val = parseFloat(e.target.value);
            if (!isNaN(val) && val > 0) {
                PaperTradingState.bot.takeProfit = val;
                savePaperTradingData();
            }
        });
    }

    if (botSlInput) {
        botSlInput.value = PaperTradingState.bot.stopLoss;
        botSlInput.addEventListener('change', (e) => {
            const val = parseFloat(e.target.value);
            if (!isNaN(val) && val > 0) {
                PaperTradingState.bot.stopLoss = val;
                savePaperTradingData();
            }
        });
    }

    // Reset Account Button
    const resetBtn = document.getElementById('paper-reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            resetPaperAccount();
        });
    }

    // Clear Trades Table Button
    const clearTradesBtn = document.getElementById('clear-trades-btn');
    if (clearTradesBtn) {
        clearTradesBtn.addEventListener('click', () => {
            if (confirm('Clear the trade history log? (Balance will not be reset)')) {
                PaperTradingState.trades = [];
                savePaperTradingData();
                updatePaperKPIs();
                renderTradeHistoryTable();
                showToast('Trade ledger cleared', 'info');
            }
        });
    }

    // Export Trades to CSV
    const exportTradesBtn = document.getElementById('export-trades-btn');
    if (exportTradesBtn) {
        exportTradesBtn.addEventListener('click', () => {
            exportTradesToCSV();
        });
    }

    // History Table Filters (All, Wins, Losses)
    document.querySelectorAll('.btn-filter-sub').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.btn-filter-sub').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            PaperTradingState.filter = btn.dataset.filter;
            renderTradeHistoryTable();
        });
    });

    // 10. Component Initialization
    initChart();
    refreshDigitGrid();

    // 11. Connect Market Feed (Hybrid Live WebSocket + Synthetic Engine)
    AppState.feedManager = new MarketFeedManager();
    AppState.feedManager.start();

    // 12. Feed Source Toggle & Config Controls
    const feedToggleBtn = document.getElementById('feed-toggle-btn');
    if (feedToggleBtn) {
        feedToggleBtn.addEventListener('click', () => {
            if (AppState.feedManager) AppState.feedManager.toggleMode();
        });
    }

    const feedConfigBtn = document.getElementById('feed-config-btn');
    if (feedConfigBtn) {
        feedConfigBtn.addEventListener('click', () => {
            const currentId = AppState.feedManager ? AppState.feedManager.customAppId : '1089';
            const userAppId = prompt('Enter Deriv App ID (Default: 1089, or register a free custom App ID at developers.deriv.com):', currentId);
            if (userAppId && userAppId.trim()) {
                AppState.feedManager.setAppId(userAppId.trim());
            }
        });
    }

    // 13. Initialize Multi-Asset Screener, Backtester, and Bot Vault (Features 1, 2, 5)
    initScreener();
    initBacktester();
    initVault();

    // Modern Web Platform: Page Visibility API for Efficient Background Processing
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            renderScreenerGrid();
            if (AppState.ticks.length > 0) {
                const latest = AppState.ticks[AppState.ticks.length - 1];
                updateHeroDigit(latest.digit, latest.price);
                updateChartWithHistory();
                refreshDigitGrid(latest.digit);
                updateSummaryKPIs();
                renderTickTape();
                updateTransitionSummary(latest.digit);
                if (AppState.isAnalyzing) updateLiveStrategyOutput();
                renderActivePositions();
                renderTradeHistoryTable();
                if (AppState.chart) AppState.chart.update('none');
                if (PaperTradingState.equityChart) PaperTradingState.equityChart.update('none');
            }
        }
    });

    // Modern Web Platform: Online/Offline Network Resilience
    window.addEventListener('online', () => {
        showToast('Internet connection restored. Reconnecting to Deriv...', 'success');
        if (AppState.feedManager) {
            AppState.feedManager.initiateRealFeed();
        }
    });

    window.addEventListener('offline', () => {
        showToast('Internet connection lost. Waiting to reconnect...', 'error');
        updateConnectionUI('Offline', 'disconnected');
    });
}

// Ensure execution regardless of script load timing
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
}
