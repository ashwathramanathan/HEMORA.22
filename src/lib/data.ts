export type RiskLevel = "Good" | "Moderate" | "Critical" | "Extreme";

export interface LocationData {
  location_name: string;
  location_type: string;
  state_ut: string;
  surface_water_pollution_pct: number;
  groundwater_pollution_pct: number;
  risk_level: RiskLevel;
  city_type: string;
  arsenic_as_pct: number;
  chromium_cr_pct: number;
  lead_pb_pct: number;
  cadmium_cd_pct: number;
  zinc_zn_pct: number;
  copper_cu_pct: number;
  nickel_ni_pct: number;
  bod_exceedance_pct: number;
  cod_exceedance_pct: number;
  do_exceedance_pct: number;
  ph_exceedance_pct: number;
  tds_exceedance_pct: number;
  primary_pollutant_source: string;
  key_heavy_metal: string;
}

export interface RiskTier {
  label: string;
  shortLabel: string;
  color: string;
  textColor: string;
  badgeClass: string;
  dotClass: string;
  borderClass: string;
  bgClass: string;
}

export function getRiskTier(pct: number): RiskTier {
  if (pct >= 50) {
    return {
      label: "Extreme 50%+",
      shortLabel: "Extreme",
      color: "#a855f7",
      textColor: "text-purple-400",
      badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/40",
      dotClass: "bg-purple-500 shadow-purple-500/50",
      borderClass: "border-purple-500/40",
      bgClass: "bg-purple-500/10",
    };
  }
  if (pct >= 40) {
    return {
      label: "Critical 40-49%",
      shortLabel: "Critical",
      color: "#ef4444",
      textColor: "text-red-400",
      badgeClass: "bg-red-500/15 text-red-300 border-red-500/40",
      dotClass: "bg-red-500 shadow-red-500/50",
      borderClass: "border-red-500/40",
      bgClass: "bg-red-500/10",
    };
  }
  if (pct >= 20) {
    return {
      label: "Moderate 20-39%",
      shortLabel: "Moderate",
      color: "#d97706",
      textColor: "text-amber-400",
      badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/40",
      dotClass: "bg-amber-500 shadow-amber-500/50",
      borderClass: "border-amber-500/40",
      bgClass: "bg-amber-500/10",
    };
  }
  return {
    label: "Good <20%",
    shortLabel: "Good",
    color: "#10b981",
    textColor: "text-emerald-400",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
    dotClass: "bg-emerald-500 shadow-emerald-500/50",
    borderClass: "border-emerald-500/40",
    bgClass: "bg-emerald-500/10",
  };
}

export function getRiskLevelFromPct(pct: number): RiskLevel {
  if (pct >= 50) return "Extreme";
  if (pct >= 40) return "Critical";
  if (pct >= 20) return "Moderate";
  return "Good";
}

export const locations: LocationData[] = [
  {
    location_name: "Kanpur",
    location_type: "City",
    state_ut: "Uttar Pradesh",
    surface_water_pollution_pct: 68,
    groundwater_pollution_pct: 55,
    risk_level: "Extreme",
    city_type: "Industrial (Tannery Hub)",
    arsenic_as_pct: 20,
    chromium_cr_pct: 35,
    lead_pb_pct: 28,
    cadmium_cd_pct: 10,
    zinc_zn_pct: 4,
    copper_cu_pct: 2,
    nickel_ni_pct: 1,
    bod_exceedance_pct: 62,
    cod_exceedance_pct: 68,
    do_exceedance_pct: 50,
    ph_exceedance_pct: 18,
    tds_exceedance_pct: 44,
    primary_pollutant_source: "Tannery effluent (~1000 units) + Ganga discharge",
    key_heavy_metal: "Chromium",
  },
  {
    location_name: "Bengaluru",
    location_type: "City",
    state_ut: "Karnataka",
    surface_water_pollution_pct: 26,
    groundwater_pollution_pct: 20,
    risk_level: "Moderate",
    city_type: "State Capital / IT Hub",
    arsenic_as_pct: 2,
    chromium_cr_pct: 36,
    lead_pb_pct: 24,
    cadmium_cd_pct: 8,
    zinc_zn_pct: 16,
    copper_cu_pct: 12,
    nickel_ni_pct: 2,
    bod_exceedance_pct: 26,
    cod_exceedance_pct: 32,
    do_exceedance_pct: 22,
    ph_exceedance_pct: 22,
    tds_exceedance_pct: 38,
    primary_pollutant_source: "Peenya industrial area + IT park runoff",
    key_heavy_metal: "Chromium",
  },
  {
    location_name: "Leh",
    location_type: "City",
    state_ut: "Ladakh",
    surface_water_pollution_pct: 12,
    groundwater_pollution_pct: 8,
    risk_level: "Good",
    city_type: "UT Capital",
    arsenic_as_pct: 8,
    chromium_cr_pct: 6,
    lead_pb_pct: 8,
    cadmium_cd_pct: 4,
    zinc_zn_pct: 8,
    copper_cu_pct: 6,
    nickel_ni_pct: 60,
    bod_exceedance_pct: 10,
    cod_exceedance_pct: 14,
    do_exceedance_pct: 8,
    ph_exceedance_pct: 8,
    tds_exceedance_pct: 10,
    primary_pollutant_source: "High altitude minimal pollution",
    key_heavy_metal: "Arsenic",
  },
];

export const stateRiskData: Record<string, number> = {
  "Andhra Pradesh": 38,
  "Arunachal Pradesh": 12,
  Assam: 24,
  Bihar: 32,
  Chhattisgarh: 28,
  Delhi: 52,
  Goa: 18,
  Gujarat: 44,
  Haryana: 36,
  "Himachal Pradesh": 16,
  Jharkhand: 42,
  Karnataka: 26,
  Kerala: 14,
  "Madhya Pradesh": 30,
  Maharashtra: 48,
  Manipur: 15,
  Meghalaya: 35,
  Mizoram: 11,
  Nagaland: 13,
  Odisha: 28,
  Punjab: 40,
  Rajasthan: 38,
  Sikkim: 8,
  "Tamil Nadu": 32,
  Telangana: 34,
  Tripura: 19,
  "Uttar Pradesh": 55,
  Uttarakhand: 22,
  "West Bengal": 46,
  "Andaman and Nicobar": 14,
  Chandigarh: 28,
  "Dadra and Nagar Haveli and Daman and Diu": 25,
  Jammu: 18,
  Kashmir: 18,
  Ladakh: 12,
  Lakshadweep: 10,
  Puducherry: 21,
};
