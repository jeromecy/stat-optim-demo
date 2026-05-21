import type { Flavor, FlavorId, DayResult, AllocationDayResult } from './types';

// ─── Constants ────────────────────────────────────────────────────────────────

export const CUSTOMERS_PER_DAY = 20;
export const PRICE_PER_SCOOP = 3;
export const OPTIMAL_FLAVOR_ID: FlavorId = 'chocolate';

export const FLAVORS: Flavor[] = [
  {
    id: 'chocolate',
    name: 'Choc Fudge',
    emoji: '🍫',
    bgColor: '#3d1c02',
    borderColor: '#a0522d',
    textColor: '#92400e',
    glowColor: 'rgba(160,82,45,0.5)',
    popularity: 0.40,
  },
  {
    id: 'vanilla',
    name: 'Vanilla Dream',
    emoji: '🍦',
    bgColor: '#3d3000',
    borderColor: '#f0c040',
    textColor: '#713f12',
    glowColor: 'rgba(240,192,64,0.5)',
    popularity: 0.28,
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    emoji: '🍓',
    bgColor: '#3d0018',
    borderColor: '#ff6b8a',
    textColor: '#9f1239',
    glowColor: 'rgba(255,107,138,0.5)',
    popularity: 0.18,
  },
  {
    id: 'matcha',
    name: 'Matcha Zen',
    emoji: '🍵',
    bgColor: '#0a2e18',
    borderColor: '#6db88f',
    textColor: '#14532d',
    glowColor: 'rgba(109,184,143,0.5)',
    popularity: 0.09,
  },
  {
    id: 'rainbow',
    name: 'Rainbow Blast',
    emoji: '🌈',
    bgColor: '#1a0040',
    borderColor: '#bb86fc',
    textColor: '#4c1d95',
    glowColor: 'rgba(187,134,252,0.5)',
    popularity: 0.05,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getFlavorById(id: FlavorId): Flavor {
  return FLAVORS.find((f) => f.id === id)!;
}

export function getMostPopularFlavor(data: Record<FlavorId, number>): FlavorId {
  let best: FlavorId = 'chocolate';
  let bestCount = -1;
  for (const [id, count] of Object.entries(data) as [FlavorId, number][]) {
    if (count > bestCount) {
      bestCount = count;
      best = id;
    }
  }
  return best;
}

export function randomAllocation(totalScoops = CUSTOMERS_PER_DAY): Record<FlavorId, number> {
  const ids = FLAVORS.map((f) => f.id);
  const allocation: Record<FlavorId, number> = {
    chocolate: 0,
    vanilla: 0,
    strawberry: 0,
    matcha: 0,
    rainbow: 0,
  };

  for (let i = 0; i < totalScoops; i++) {
    const id = ids[Math.floor(Math.random() * ids.length)];
    allocation[id] += 1;
  }

  return allocation;
}

export function simulateAllocationStrategy(
  allocation: Record<FlavorId, number>,
  days: number,
  round: number
): AllocationDayResult[] {
  const results: AllocationDayResult[] = [];
  for (let d = 1; d <= days; d++) {
    results.push(simulateAllocationDay({ ...allocation }, d, round));
  }
  return results;
}

// ─── Simulation ───────────────────────────────────────────────────────────────

/**
 * Simulate how many customers buy the given flavor in one day.
 * Each customer independently prefers this flavor with probability = flavor.popularity.
 */
export function simulateCustomersToBuy(flavorId: FlavorId): number {
  const flavor = getFlavorById(flavorId);
  let count = 0;
  for (let i = 0; i < CUSTOMERS_PER_DAY; i++) {
    if (Math.random() < flavor.popularity) count++;
  }
  return count;
}

/**
 * Simulate one full day of trading: player picks a flavor.
 */
export function simulateOneDay(
  flavorId: FlavorId,
  day: number,
  round: number
): DayResult {
  const served = simulateCustomersToBuy(flavorId);
  const optimalServed = simulateCustomersToBuy(OPTIMAL_FLAVOR_ID);
  return {
    day,
    round,
    chosenFlavor: flavorId,
    customersServed: served,
    revenue: served * PRICE_PER_SCOOP,
    optimalRevenue: optimalServed * PRICE_PER_SCOOP,
  };
}

/**
 * Simulate what all 20 customers actually WANT (for data collection visualization).
 * Returns per-flavor counts.
 */
export function sampleCustomerPreferences(): Record<FlavorId, number> {
  const counts: Record<FlavorId, number> = {
    chocolate: 0,
    vanilla: 0,
    strawberry: 0,
    matcha: 0,
    rainbow: 0,
  };
  for (let i = 0; i < CUSTOMERS_PER_DAY; i++) {
    const rand = Math.random();
    let cum = 0;
    for (const flavor of FLAVORS) {
      cum += flavor.popularity;
      if (rand < cum) {
        counts[flavor.id]++;
        break;
      }
    }
  }
  return counts;
}

/**
 * Simulate one day with 20-scoop allocation across flavours.
 * Each customer wants a flavour sampled from the true distribution.
 * sold = min(allocation, demand), wasted = surplus, missed = unmet demand.
 */
export function simulateAllocationDay(
  allocation: Record<FlavorId, number>,
  day: number,
  round: number
): AllocationDayResult {
  const demand = sampleCustomerPreferences();
  const sold: Record<FlavorId, number> = { chocolate: 0, vanilla: 0, strawberry: 0, matcha: 0, rainbow: 0 };
  const wasted: Record<FlavorId, number> = { chocolate: 0, vanilla: 0, strawberry: 0, matcha: 0, rainbow: 0 };
  const missed: Record<FlavorId, number> = { chocolate: 0, vanilla: 0, strawberry: 0, matcha: 0, rainbow: 0 };

  for (const f of FLAVORS) {
    const d = demand[f.id] ?? 0;
    const a = allocation[f.id] ?? 0;
    sold[f.id] = Math.min(d, a);
    wasted[f.id] = Math.max(0, a - d);
    missed[f.id] = Math.max(0, d - a);
  }

  const revenue = FLAVORS.reduce((sum, f) => sum + (sold[f.id] ?? 0) * PRICE_PER_SCOOP, 0);
  const optimalRevenue = simulateCustomersToBuy(OPTIMAL_FLAVOR_ID) * PRICE_PER_SCOOP;

  return { day, round, allocation, demand, sold, wasted, missed, revenue, optimalRevenue };
}

/**
 * Simulate N days of a pure-random strategy (benchmark).
 */
export function simulateRandomStrategy(days: number): number {
  let total = 0;
  for (let d = 0; d < days; d++) {
    const randomFlavor = FLAVORS[Math.floor(Math.random() * FLAVORS.length)].id;
    total += simulateCustomersToBuy(randomFlavor) * PRICE_PER_SCOOP;
  }
  return total;
}

/**
 * Simulate N days of the optimal strategy (always best flavor).
 */
export function simulateOptimalStrategy(days: number): number {
  let total = 0;
  for (let d = 0; d < days; d++) {
    total += simulateCustomersToBuy(OPTIMAL_FLAVOR_ID) * PRICE_PER_SCOOP;
  }
  return total;
}

/**
 * Simulate epsilon-greedy for Round 4.
 * explorationPct 0 = always exploit best known, 100 = always explore randomly.
 */
export function simulateEpsilonGreedy(
  days: number,
  explorationPct: number,
  priorData: Record<FlavorId, number>
): DayResult[] {
  const results: DayResult[] = [];
  const epsilon = explorationPct / 100;

  // Build initial estimates from prior data
  const totalSampled = Object.values(priorData).reduce((a, b) => a + b, 0);
  const estimates: Record<FlavorId, number> = {} as Record<FlavorId, number>;
  for (const flavor of FLAVORS) {
    estimates[flavor.id] =
      totalSampled > 0
        ? (priorData[flavor.id] ?? 0) / totalSampled
        : 1 / FLAVORS.length;
  }

  for (let d = 1; d <= days; d++) {
    let chosen: FlavorId;
    if (Math.random() < epsilon) {
      // Explore: random flavor
      chosen = FLAVORS[Math.floor(Math.random() * FLAVORS.length)].id;
    } else {
      // Exploit: best estimated flavor
      chosen = FLAVORS.reduce(
        (best, f) => (estimates[f.id] > estimates[best] ? f.id : best),
        FLAVORS[0].id
      );
    }

    const served = simulateCustomersToBuy(chosen);
    const revenue = served * PRICE_PER_SCOOP;
    const optimalServed = simulateCustomersToBuy(OPTIMAL_FLAVOR_ID);

    // Update estimate for chosen flavor (running mean)
    const n = totalSampled + d * CUSTOMERS_PER_DAY;
    estimates[chosen] =
      (estimates[chosen] * (n - CUSTOMERS_PER_DAY) + served) / n;

    results.push({
      day: d,
      round: 4,
      chosenFlavor: chosen,
      customersServed: served,
      revenue,
      optimalRevenue: optimalServed * PRICE_PER_SCOOP,
    });
  }

  return results;
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

export function getProgressPercent(screen: string): number {
  const map: Record<string, number> = {
    intro: 0,
    round1: 18,
    round2: 38,
    round3: 58,
    round4: 78,
    final: 88,
    realworld: 94,
    futures: 100,
  };
  return map[screen] ?? 0;
}

export function gradePerformance(
  playerProfit: number,
  randomProfit: number,
  optimalProfit: number
): { grade: string; message: string; color: string; ratio: number } {
  const ratio = (playerProfit - randomProfit) / Math.max(1, optimalProfit - randomProfit);
  if (ratio >= 0.85) return { grade: 'A+', message: 'Optimisation Master! 🏆', color: '#ffd60a', ratio };
  if (ratio >= 0.70) return { grade: 'A', message: 'Data Wizard! 🌟', color: '#ffd60a', ratio };
  if (ratio >= 0.50) return { grade: 'B', message: 'Smart Analyst! 📊', color: '#06d6a0', ratio };
  if (ratio >= 0.25) return { grade: 'C', message: 'Good Start! 📈', color: '#3b82f6', ratio };
  return { grade: 'D', message: 'Keep Exploring! 🔍', color: '#f97316', ratio };
}

// ─── Allocation-based Benchmarks ─────────────────────────────────────────────

/**
 * Proportional allocation matching true flavor popularity.
 * chocolate:40% → 8, vanilla:28% → 6, strawberry:18% → 4, matcha:9% → 2, rainbow:5% → 0
 */
export const OPTIMAL_ALLOCATION: Record<FlavorId, number> = {
  chocolate: 8,
  vanilla: 6,
  strawberry: 4,
  matcha: 2,
  rainbow: 0,
};

/** Simulate N days always using proportional optimal allocation. */
export function simulateOptimalAllocationStrategy(days: number): number {
  let total = 0;
  for (let d = 0; d < days; d++) {
    total += simulateAllocationDay({ ...OPTIMAL_ALLOCATION }, d + 1, 0).revenue;
  }
  return total;
}

/** Simulate N days always using equal split (naive gut-feeling baseline). */
export function simulateNaiveAllocationStrategy(days: number): number {
  const naive: Record<FlavorId, number> = { chocolate: 4, vanilla: 4, strawberry: 4, matcha: 4, rainbow: 4 };
  let total = 0;
  for (let d = 0; d < days; d++) {
    total += simulateAllocationDay({ ...naive }, d + 1, 0).revenue;
  }
  return total;
}
