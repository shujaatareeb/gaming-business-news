"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  AreaSeries,
  HistogramSeries,
  type IChartApi,
  type ISeriesApi,
  type SeriesType,
  ColorType,
  LineStyle,
} from "lightweight-charts";
import type { OHLCDataPoint } from "@/lib/stock-data";

/* ─── Types ─── */
type ChartStyle = "Candlestick" | "Line" | "Area";
type Indicator = "MA" | "Momentum" | "MACD" | "Stochastics" | "RSI" | "Bollinger";

const PERIODS = [
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
  { label: "1Y", days: 365 },
  { label: "5Y", days: 1825 },
] as const;

const CHART_STYLES: ChartStyle[] = ["Candlestick", "Line", "Area"];

const INDICATORS: { label: string; value: Indicator }[] = [
  { label: "Moving Average (20)", value: "MA" },
  { label: "RSI (14)", value: "RSI" },
  { label: "MACD", value: "MACD" },
  { label: "Bollinger Bands", value: "Bollinger" },
  { label: "Momentum (10)", value: "Momentum" },
  { label: "Stochastics (14)", value: "Stochastics" },
];

/* ─── Indicator math ─── */
function calcSMA(data: OHLCDataPoint[], period: number): { time: string; value: number }[] {
  const result: { time: string; value: number }[] = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) sum += data[i - j].close;
    result.push({ time: data[i].time, value: Math.round((sum / period) * 100) / 100 });
  }
  return result;
}

function calcEMA(data: OHLCDataPoint[], period: number): { time: string; value: number }[] {
  const result: { time: string; value: number }[] = [];
  const k = 2 / (period + 1);
  let ema = data.slice(0, period).reduce((s, d) => s + d.close, 0) / period;
  result.push({ time: data[period - 1].time, value: Math.round(ema * 100) / 100 });
  for (let i = period; i < data.length; i++) {
    ema = data[i].close * k + ema * (1 - k);
    result.push({ time: data[i].time, value: Math.round(ema * 100) / 100 });
  }
  return result;
}

function calcRSI(data: OHLCDataPoint[], period: number = 14): { time: string; value: number }[] {
  const result: { time: string; value: number }[] = [];
  const changes = data.map((d, i) => i === 0 ? 0 : d.close - data[i - 1].close);
  let avgGain = 0, avgLoss = 0;
  for (let i = 1; i <= period; i++) {
    if (changes[i] > 0) avgGain += changes[i];
    else avgLoss -= changes[i];
  }
  avgGain /= period;
  avgLoss /= period;
  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  result.push({ time: data[period].time, value: Math.round((100 - 100 / (1 + rs)) * 100) / 100 });

  for (let i = period + 1; i < data.length; i++) {
    const change = changes[i];
    avgGain = (avgGain * (period - 1) + (change > 0 ? change : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (change < 0 ? -change : 0)) / period;
    const rsi = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
    result.push({ time: data[i].time, value: Math.round(rsi * 100) / 100 });
  }
  return result;
}

function calcMACD(data: OHLCDataPoint[]) {
  const ema12 = calcEMA(data, 12);
  const ema26 = calcEMA(data, 26);
  const offset = ema12.length - ema26.length;

  const macdLine: { time: string; value: number }[] = [];
  for (let i = 0; i < ema26.length; i++) {
    macdLine.push({
      time: ema26[i].time,
      value: Math.round((ema12[i + offset].value - ema26[i].value) * 100) / 100,
    });
  }

  // Signal line (9-period EMA of MACD)
  const signalPeriod = 9;
  const signalLine: { time: string; value: number }[] = [];
  if (macdLine.length >= signalPeriod) {
    const k = 2 / (signalPeriod + 1);
    let ema = macdLine.slice(0, signalPeriod).reduce((s, d) => s + d.value, 0) / signalPeriod;
    signalLine.push({ time: macdLine[signalPeriod - 1].time, value: Math.round(ema * 100) / 100 });
    for (let i = signalPeriod; i < macdLine.length; i++) {
      ema = macdLine[i].value * k + ema * (1 - k);
      signalLine.push({ time: macdLine[i].time, value: Math.round(ema * 100) / 100 });
    }
  }

  // Histogram
  const histogram: { time: string; value: number; color: string }[] = [];
  const signalOffset = macdLine.length - signalLine.length;
  for (let i = 0; i < signalLine.length; i++) {
    const val = macdLine[i + signalOffset].value - signalLine[i].value;
    histogram.push({
      time: signalLine[i].time,
      value: Math.round(val * 100) / 100,
      color: val >= 0 ? "rgba(22,163,74,0.5)" : "rgba(220,38,38,0.5)",
    });
  }

  return { macdLine, signalLine, histogram };
}

function calcBollinger(data: OHLCDataPoint[], period: number = 20, mult: number = 2) {
  const middle = calcSMA(data, period);
  const upper: { time: string; value: number }[] = [];
  const lower: { time: string; value: number }[] = [];

  for (let i = 0; i < middle.length; i++) {
    const idx = i + period - 1;
    let sumSq = 0;
    for (let j = 0; j < period; j++) {
      const diff = data[idx - j].close - middle[i].value;
      sumSq += diff * diff;
    }
    const std = Math.sqrt(sumSq / period);
    upper.push({ time: middle[i].time, value: Math.round((middle[i].value + mult * std) * 100) / 100 });
    lower.push({ time: middle[i].time, value: Math.round((middle[i].value - mult * std) * 100) / 100 });
  }

  return { middle, upper, lower };
}

function calcMomentum(data: OHLCDataPoint[], period: number = 10): { time: string; value: number }[] {
  const result: { time: string; value: number }[] = [];
  for (let i = period; i < data.length; i++) {
    result.push({
      time: data[i].time,
      value: Math.round((data[i].close - data[i - period].close) * 100) / 100,
    });
  }
  return result;
}

function calcStochastics(data: OHLCDataPoint[], period: number = 14) {
  const kLine: { time: string; value: number }[] = [];
  for (let i = period - 1; i < data.length; i++) {
    let high = -Infinity, low = Infinity;
    for (let j = 0; j < period; j++) {
      if (data[i - j].high > high) high = data[i - j].high;
      if (data[i - j].low < low) low = data[i - j].low;
    }
    const k = high === low ? 50 : ((data[i].close - low) / (high - low)) * 100;
    kLine.push({ time: data[i].time, value: Math.round(k * 100) / 100 });
  }

  // %D = 3-period SMA of %K
  const dLine: { time: string; value: number }[] = [];
  for (let i = 2; i < kLine.length; i++) {
    const avg = (kLine[i].value + kLine[i - 1].value + kLine[i - 2].value) / 3;
    dLine.push({ time: kLine[i].time, value: Math.round(avg * 100) / 100 });
  }

  return { kLine, dLine };
}

/* ─── Component ─── */
interface StockChartProps {
  ticker: string;
  currentPrice: number;
  change: number;
  allData: Record<string, OHLCDataPoint[]>;
}

export function StockChart({ ticker, currentPrice, change, allData }: StockChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePeriod, setActivePeriod] = useState(1);
  const [chartStyle, setChartStyle] = useState<ChartStyle>("Candlestick");
  const [activeIndicators, setActiveIndicators] = useState<Set<Indicator>>(new Set());
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [showIndicatorMenu, setShowIndicatorMenu] = useState(false);
  const chartRef = useRef<IChartApi | null>(null);
  const extraSeriesRef = useRef<ISeriesApi<SeriesType>[]>([]);

  const isPositive = change >= 0;

  const toggleIndicator = (ind: Indicator) => {
    setActiveIndicators((prev) => {
      const next = new Set(prev);
      if (next.has(ind)) next.delete(ind);
      else next.add(ind);
      return next;
    });
  };

  const buildChart = useCallback(() => {
    if (!containerRef.current) return;

    // Cleanup previous
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      extraSeriesRef.current = [];
    }

    const data = allData[PERIODS[activePeriod].label] || [];
    if (data.length === 0) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 380,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#a1a1aa",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "#27272a", style: LineStyle.Dotted },
        horzLines: { color: "#27272a", style: LineStyle.Dotted },
      },
      rightPriceScale: {
        borderColor: "#3f3f46",
        scaleMargins: { top: 0.05, bottom: 0.15 },
      },
      timeScale: {
        borderColor: "#3f3f46",
        timeVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      crosshair: {
        vertLine: { color: "#71717a", width: 1, style: LineStyle.Dashed, labelBackgroundColor: "#18181b" },
        horzLine: { color: "#71717a", width: 1, style: LineStyle.Dashed, labelBackgroundColor: "#18181b" },
      },
    });

    chartRef.current = chart;

    // Main series
    if (chartStyle === "Candlestick") {
      const series = chart.addSeries(CandlestickSeries, {
        upColor: "#16a34a",
        downColor: "#dc2626",
        borderUpColor: "#16a34a",
        borderDownColor: "#dc2626",
        wickUpColor: "#16a34a",
        wickDownColor: "#dc2626",
      });
      series.setData(data.map((d) => ({ time: d.time, open: d.open, high: d.high, low: d.low, close: d.close })));
    } else if (chartStyle === "Line") {
      const series = chart.addSeries(LineSeries, {
        color: isPositive ? "#16a34a" : "#dc2626",
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 4,
      });
      series.setData(data.map((d) => ({ time: d.time, value: d.close })));
    } else {
      const series = chart.addSeries(AreaSeries, {
        lineColor: isPositive ? "#16a34a" : "#dc2626",
        topColor: isPositive ? "rgba(22,163,74,0.15)" : "rgba(220,38,38,0.15)",
        bottomColor: isPositive ? "rgba(22,163,74,0.02)" : "rgba(220,38,38,0.02)",
        lineWidth: 2,
      });
      series.setData(data.map((d) => ({ time: d.time, value: d.close })));
    }

    // Volume
    const volSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });
    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.85, bottom: 0 },
      borderVisible: false,
    });
    volSeries.setData(data.map((d) => ({
      time: d.time,
      value: d.volume,
      color: d.close >= d.open ? "rgba(22,163,74,0.15)" : "rgba(220,38,38,0.15)",
    })));
    extraSeriesRef.current.push(volSeries);

    // Indicators
    if (activeIndicators.has("MA")) {
      const ma = calcSMA(data, 20);
      const s = chart.addSeries(LineSeries, { color: "#6366f1", lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
      s.setData(ma);
      extraSeriesRef.current.push(s);
    }

    if (activeIndicators.has("Bollinger")) {
      const bb = calcBollinger(data, 20, 2);
      const sM = chart.addSeries(LineSeries, { color: "#6366f1", lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
      sM.setData(bb.middle);
      const sU = chart.addSeries(LineSeries, { color: "#71717a", lineWidth: 1, lineStyle: LineStyle.Dashed, priceLineVisible: false, lastValueVisible: false });
      sU.setData(bb.upper);
      const sL = chart.addSeries(LineSeries, { color: "#71717a", lineWidth: 1, lineStyle: LineStyle.Dashed, priceLineVisible: false, lastValueVisible: false });
      sL.setData(bb.lower);
      extraSeriesRef.current.push(sM, sU, sL);
    }

    if (activeIndicators.has("RSI")) {
      const rsi = calcRSI(data, 14);
      const s = chart.addSeries(LineSeries, {
        color: "#d97706",
        lineWidth: 1,
        priceScaleId: "rsi",
        priceLineVisible: false,
        lastValueVisible: false,
      });
      chart.priceScale("rsi").applyOptions({
        scaleMargins: { top: 0.8, bottom: 0.02 },
        borderVisible: false,
      });
      s.setData(rsi);
      extraSeriesRef.current.push(s);
    }

    if (activeIndicators.has("MACD")) {
      const macd = calcMACD(data);
      const sLine = chart.addSeries(LineSeries, { color: "#0891b2", lineWidth: 1, priceScaleId: "macd", priceLineVisible: false, lastValueVisible: false });
      sLine.setData(macd.macdLine);
      const sSignal = chart.addSeries(LineSeries, { color: "#dc2626", lineWidth: 1, priceScaleId: "macd", priceLineVisible: false, lastValueVisible: false });
      sSignal.setData(macd.signalLine);
      const sHist = chart.addSeries(HistogramSeries, { priceScaleId: "macd", priceLineVisible: false, lastValueVisible: false });
      sHist.setData(macd.histogram);
      chart.priceScale("macd").applyOptions({
        scaleMargins: { top: 0.8, bottom: 0.02 },
        borderVisible: false,
      });
      extraSeriesRef.current.push(sLine, sSignal, sHist);
    }

    if (activeIndicators.has("Momentum")) {
      const mom = calcMomentum(data, 10);
      const s = chart.addSeries(LineSeries, {
        color: "#7c3aed",
        lineWidth: 1,
        priceScaleId: "momentum",
        priceLineVisible: false,
        lastValueVisible: false,
      });
      chart.priceScale("momentum").applyOptions({
        scaleMargins: { top: 0.8, bottom: 0.02 },
        borderVisible: false,
      });
      s.setData(mom);
      extraSeriesRef.current.push(s);
    }

    if (activeIndicators.has("Stochastics")) {
      const stoch = calcStochastics(data, 14);
      const sK = chart.addSeries(LineSeries, { color: "#0891b2", lineWidth: 1, priceScaleId: "stoch", priceLineVisible: false, lastValueVisible: false });
      sK.setData(stoch.kLine);
      const sD = chart.addSeries(LineSeries, { color: "#dc2626", lineWidth: 1, lineStyle: LineStyle.Dashed, priceScaleId: "stoch", priceLineVisible: false, lastValueVisible: false });
      sD.setData(stoch.dLine);
      chart.priceScale("stoch").applyOptions({
        scaleMargins: { top: 0.8, bottom: 0.02 },
        borderVisible: false,
      });
      extraSeriesRef.current.push(sK, sD);
    }

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
      extraSeriesRef.current = [];
    };
  }, [ticker, activePeriod, chartStyle, activeIndicators, allData, isPositive]);

  useEffect(() => {
    const cleanup = buildChart();
    return cleanup;
  }, [buildChart]);

  // Close menus on outside click
  useEffect(() => {
    const handler = () => { setShowStyleMenu(false); setShowIndicatorMenu(false); };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="border border-border rounded-lg bg-surface">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Chart style dropdown */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowStyleMenu((v) => !v); setShowIndicatorMenu(false); }}
              className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground border border-border rounded-lg px-3 py-1.5 transition"
            >
              {chartStyle}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showStyleMenu && (
              <div className="absolute top-full left-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-20 min-w-[140px] py-1" onClick={(e) => e.stopPropagation()}>
                {CHART_STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => { setChartStyle(style); setShowStyleMenu(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition ${
                      style === chartStyle ? "bg-surface-alt font-medium text-foreground" : "text-muted hover:bg-surface-alt hover:text-foreground"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Indicator dropdown */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowIndicatorMenu((v) => !v); setShowStyleMenu(false); }}
              className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground border border-border rounded-lg px-3 py-1.5 transition"
            >
              Indicators{activeIndicators.size > 0 && (
                <span className="bg-foreground text-surface text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {activeIndicators.size}
                </span>
              )}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showIndicatorMenu && (
              <div className="absolute top-full left-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-20 min-w-[200px] py-1" onClick={(e) => e.stopPropagation()}>
                {INDICATORS.map((ind) => {
                  const active = activeIndicators.has(ind.value);
                  return (
                    <button
                      key={ind.value}
                      onClick={() => toggleIndicator(ind.value)}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition ${
                        active ? "bg-surface-alt text-foreground" : "text-muted hover:bg-surface-alt hover:text-foreground"
                      }`}
                    >
                      {ind.label}
                      {active && (
                        <svg className="w-4 h-4 text-status-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active indicator tags */}
          {Array.from(activeIndicators).map((ind) => (
            <span key={ind} className="text-[10px] font-semibold bg-surface-alt border border-border px-2 py-1 rounded-full flex items-center gap-1">
              {ind}
              <button onClick={() => toggleIndicator(ind)} className="text-muted hover:text-foreground">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>

        {/* Period selector */}
        <div className="flex gap-1 bg-surface-alt rounded-lg p-0.5">
          {PERIODS.map((period, i) => (
            <button
              key={period.label}
              onClick={() => setActivePeriod(i)}
              className={`px-3 py-1.5 rounded-md text-[11px] transition ${
                i === activePeriod
                  ? "bg-surface font-semibold text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div ref={containerRef} className="w-full" />
    </div>
  );
}
