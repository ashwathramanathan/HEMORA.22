"use client";

import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Droplets, Waves, FlaskConical, ShieldAlert, Factory } from "lucide-react";
import { getRiskTier, type LocationData } from "@/lib/data";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  ChartTooltip,
  ChartLegend,
  Title
);

interface StatsDashboardProps {
  location: LocationData | null;
}

const METAL_LABELS: Record<string, string> = {
  arsenic_as_pct: "Arsenic (As)",
  chromium_cr_pct: "Chromium (Cr)",
  lead_pb_pct: "Lead (Pb)",
  cadmium_cd_pct: "Cadmium (Cd)",
  zinc_zn_pct: "Zinc (Zn)",
  copper_cu_pct: "Copper (Cu)",
  nickel_ni_pct: "Nickel (Ni)",
};

const METAL_COLORS: Record<string, string> = {
  arsenic_as_pct: "#ef4444",
  chromium_cr_pct: "#a855f7",
  lead_pb_pct: "#fb923c",
  cadmium_cd_pct: "#facc15",
  zinc_zn_pct: "#00D4FF",
  copper_cu_pct: "#fbbf24",
  nickel_ni_pct: "#6366f1",
};

function GaugeCard({ label, value, unit, delay }: { label: string; value: number; unit: string; delay: number }) {
  const color = value >= 50 ? "#ef4444" : value >= 30 ? "#d97706" : "#10b981";
  return (
    <div className="bg-navy-950/40 rounded-xl border border-navy-700/50 p-3 text-center">
      <div className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">{label}</div>
      <div className="text-lg font-black mt-1" style={{ color }}>
        {value}
        {unit}
      </div>
      <div className="mt-2 h-1.5 bg-navy-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full progress-bar-fill"
          style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color, animationDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}

export default function StatsDashboard({ location }: StatsDashboardProps) {
  if (!location) {
    return (
      <section id="phase-3" className="phase-section max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="glass-card p-12 text-center">
          <FlaskConical className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-400 mb-2">No location selected</h3>
          <p className="text-sm text-slate-500">
            Select a location from the search above to view its full contamination telemetry.
          </p>
        </div>
      </section>
    );
  }

  const tier = getRiskTier(location.surface_water_pollution_pct);

  const metalKeys = Object.keys(METAL_LABELS);
  const chartData = {
    labels: metalKeys.map((k) => METAL_LABELS[k]),
    datasets: [
      {
        label: "% of Toxicity Load",
        data: metalKeys.map((k) => (location as any)[k] as number),
        backgroundColor: metalKeys.map((k) => METAL_COLORS[k] + "CC"),
        borderColor: metalKeys.map((k) => METAL_COLORS[k]),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0E1525",
        borderColor: "#243352",
        borderWidth: 1,
        titleColor: "#fff",
        bodyColor: "#94a3b8",
        padding: 12,
        callbacks: {
          label: (ctx: any) => `${ctx.parsed.x}% of toxicity load`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 70,
        grid: { color: "rgba(36, 51, 82, 0.4)" },
        ticks: { color: "#64748b", font: { size: 10 } },
      },
      y: {
        grid: { display: false },
        ticks: { color: "#94a3b8", font: { size: 11, weight: 600 as const } },
      },
    },
  };

  return (
    <section id="phase-3" className="phase-section max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-teal-500/10 text-teal-400 border border-teal-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <FlaskConical className="w-3.5 h-3.5" />
          Phase 3 — Stats Dashboard
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Contamination Telemetry: <span className="text-teal-400">{location.location_name}</span>
        </h2>
        <p className="text-slate-400 text-sm">
          {location.state_ut} · {location.city_type}
        </p>
      </div>

      <div className="glass-card p-5 sm:p-7">
        {/* Risk badge */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pb-6 border-b border-navy-700/50">
          <div>
            <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Risk Assessment</span>
            <div className="text-sm text-slate-300 mt-1">{location.primary_pollutant_source}</div>
          </div>
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${tier.badgeClass}`}
          >
            {tier.label}
          </span>
        </div>

        {/* Two big stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-navy-950/50 border border-navy-700/50 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl" />
            <div className="flex items-center gap-2 mb-3 relative">
              <div className="p-2 bg-teal-500/10 rounded-lg">
                <Droplets className="w-5 h-5 text-teal-400" />
              </div>
              <span className="text-xs uppercase text-slate-400 font-bold">Surface Water Pollution</span>
            </div>
            <div className="text-4xl sm:text-5xl font-black" style={{ color: tier.color }}>
              {location.surface_water_pollution_pct}%
            </div>
            <div className="text-xs text-slate-500 mt-1">River &amp; basin contamination load</div>
            <div className="mt-3 h-2 bg-navy-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full progress-bar-fill"
                style={{ width: `${location.surface_water_pollution_pct}%`, backgroundColor: tier.color }}
              />
            </div>
          </div>

          <div className="bg-navy-950/50 border border-navy-700/50 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl" />
            <div className="flex items-center gap-2 mb-3 relative">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Waves className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-xs uppercase text-slate-400 font-bold">Groundwater Pollution</span>
            </div>
            <div className="text-4xl sm:text-5xl font-black" style={{ color: tier.color }}>
              {location.groundwater_pollution_pct}%
            </div>
            <div className="text-xs text-slate-500 mt-1">Aquifer depth contamination</div>
            <div className="mt-3 h-2 bg-navy-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full progress-bar-fill"
                style={{ width: `${location.groundwater_pollution_pct}%`, backgroundColor: tier.color }}
              />
            </div>
          </div>
        </div>

        {/* Key metal + source */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-navy-950/40 border border-navy-700/50 p-4 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-red-500/10 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-[10px] uppercase text-slate-500 font-semibold">Key Heavy Metal</div>
              <div className="text-lg font-black text-white">{location.key_heavy_metal}</div>
            </div>
          </div>
          <div className="bg-navy-950/40 border border-navy-700/50 p-4 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-lg">
              <Factory className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-[10px] uppercase text-slate-500 font-semibold">Primary Pollutant Source</div>
              <div className="text-sm font-semibold text-white leading-tight">
                {location.primary_pollutant_source}
              </div>
            </div>
          </div>
        </div>

        {/* Heavy metals bar chart */}
        <div className="bg-navy-950/40 border border-navy-700/50 p-5 rounded-2xl mb-6">
          <h4 className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-4">
            Heavy Metal Concentration Distribution (% of Toxicity Load)
          </h4>
          <div style={{ height: "280px" }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* 5 gauge cards */}
        <div>
          <h4 className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-3">
            Biochemical Parameter Exceedance
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <GaugeCard label="BOD" value={location.bod_exceedance_pct} unit="%" delay={0} />
            <GaugeCard label="COD" value={location.cod_exceedance_pct} unit="%" delay={100} />
            <GaugeCard label="DO" value={location.do_exceedance_pct} unit="%" delay={200} />
            <GaugeCard label="pH" value={location.ph_exceedance_pct} unit="%" delay={300} />
            <GaugeCard label="TDS" value={location.tds_exceedance_pct} unit="%" delay={400} />
          </div>
        </div>
      </div>
    </section>
  );
}
