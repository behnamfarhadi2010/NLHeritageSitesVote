const K_FACTOR = 32;

export interface EloUpdate {
  winnerScoreAfter: number;
  loserScoreAfter: number;
  delta: number;
}

export function computeElo(
  winnerScore: number,
  loserScore: number,
  k: number = K_FACTOR,
): EloUpdate {
  const expectedWinner =
    1 / (1 + Math.pow(10, (loserScore - winnerScore) / 400));
  const change = k * (1 - expectedWinner);
  const rounded = Math.round(change);
  return {
    winnerScoreAfter: winnerScore + rounded,
    loserScoreAfter: loserScore - rounded,
    delta: rounded,
  };
}
