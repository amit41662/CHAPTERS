import type { ConstellationPoint, ConstellationData } from '../types/models';

export function buildConstellation(
  emojis: { emoji: string; isMeaningful: boolean }[]
): ConstellationData {
  if (emojis.length === 0) {
    return { points: [], connections: [] };
  }

  const points: ConstellationPoint[] = emojis.map((e, i) => {
    // Distribute points in a pleasing pattern
    const angle = (i / emojis.length) * Math.PI * 2 + Math.PI / 6;
    const radius = 0.2 + Math.random() * 0.2;
    const x = 0.5 + Math.cos(angle) * radius;
    const y = 0.5 + Math.sin(angle) * radius * 0.7; // squash vertically
    return {
      emoji: e.emoji,
      x: Math.max(0.1, Math.min(0.9, x)),
      y: Math.max(0.1, Math.min(0.9, y)),
      isMeaningful: e.isMeaningful,
    };
  });

  // Connect adjacent points
  const connections: [number, number][] = [];
  for (let i = 0; i < points.length - 1; i++) {
    connections.push([i, i + 1]);
  }
  // Close the loop if enough points
  if (points.length >= 3) {
    connections.push([points.length - 1, 0]);
  }

  return { points, connections };
}

export function buildConstellationDeterministic(
  emojis: { emoji: string; isMeaningful: boolean }[]
): ConstellationData {
  if (emojis.length === 0) {
    return { points: [], connections: [] };
  }

  // Deterministic layout using golden angle
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  const points: ConstellationPoint[] = emojis.map((e, i) => {
    const angle = i * goldenAngle;
    const radius = 0.15 + (i / emojis.length) * 0.2;
    const x = 0.5 + Math.cos(angle) * radius;
    const y = 0.5 + Math.sin(angle) * radius * 0.6;
    return {
      emoji: e.emoji,
      x: Math.max(0.1, Math.min(0.9, x)),
      y: Math.max(0.15, Math.min(0.85, y)),
      isMeaningful: e.isMeaningful,
    };
  });

  const connections: [number, number][] = [];
  for (let i = 0; i < points.length - 1; i++) {
    connections.push([i, i + 1]);
  }
  if (points.length >= 3) {
    connections.push([points.length - 1, 0]);
  }

  return { points, connections };
}
