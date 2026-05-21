export type FlavorId = 'chocolate' | 'vanilla' | 'strawberry' | 'matcha' | 'rainbow';

export interface Flavor {
  id: FlavorId;
  name: string;
  emoji: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  glowColor: string;
  popularity: number;
}

export interface DayResult {
  day: number;
  round: number;
  chosenFlavor: FlavorId;
  customersServed: number;
  revenue: number;
  optimalRevenue: number;
}

export interface AllocationDayResult {
  day: number;
  round: number;
  allocation: Record<FlavorId, number>;
  demand: Record<FlavorId, number>;
  sold: Record<FlavorId, number>;
  wasted: Record<FlavorId, number>;
  missed: Record<FlavorId, number>;
  revenue: number;
  optimalRevenue: number;
}

export type Screen =
  | 'intro'
  | 'round1'
  | 'round2'
  | 'round3'
  | 'round4'
  | 'final'
  | 'realworld'
  | 'futures';

export interface Round1Data {
  allocation: Record<FlavorId, number>;
  results: AllocationDayResult[];
  totalProfit: number;
}

export interface Round2Data {
  allocation: Record<FlavorId, number>;
  results: AllocationDayResult[];
  totalProfit: number;
}

export interface Round3Data {
  totalProfit: number;
  reallocationIntensity: number;
}

export interface RegionAllocationResult {
  region: string;
  allocation: number;
  demand: number;
  sold: number;
  transportCost: number;
  netProfit: number;
}

export interface Round4Data {
  allocation: Record<string, number>;
  results: RegionAllocationResult[];
  totalProfit: number;
}
