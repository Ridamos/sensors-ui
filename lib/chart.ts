// Поділки осі Y: «круглі» числа, що накривають діапазон [min, max].
// Крок вибирається з ряду 1, 2, 5, 10, 20, 50, 100… так, щоб поділок було не більше maxCount.
export function axisTicks(min: number, max: number, maxCount = 6): number[] {
  let step = 1;
  for (const candidate of [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000]) {
    step = candidate;
    if ((max - min) / candidate <= maxCount - 1) break;
  }
  const first = Math.floor(min / step) * step;
  const last = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let tick = first; tick <= last; tick += step) ticks.push(tick);
  return ticks;
}
