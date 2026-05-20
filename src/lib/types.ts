export type FlavorId = 'chocolate' | 'vanilla' | 'strawberry' | 'matcha' | 'rainbow';

export interface Flavor {
  id: FlavorId;
  name: string;
  emoji: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  glowColor: string;
  popularity: number; // true popularity, hidden from user initially
}

export interface DayResult {
  day: number;
  round: number;
  chosenFlavor: FlavorId;
  customersServed: number;
  revenue: number;
  optimalRevenue: number; // what best strategy would have earned
}

export type Screen =
  | 'intro'
  | 'round1'
  | 'round2'
  | 'round3'
  | 'round4'
  | 'final'
  | 'realworld';

export interface Round1Data {
  results: DayResult[];
  totalProfit: number;
}

export interface Round2Data {
  results: DayResult[];
  totalProfit: number;
  customerData: Record<FlavorId, number>;
}

export interface Round3Data {
  guess: FlavorId;
  correct: boolean;
  scoreEarned: number;
}

export interface Round4Data {
  explorationRate: number;
  results: DayResult[];
  totalProfit: number;
}
