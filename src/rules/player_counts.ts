// Acceptable player counts in a Sidereal game
export type PlayerCount = 4 | 5 | 6 | 7 | 8 | 9;

export const playerCounts: PlayerCount[] = [4, 5, 6, 7, 8, 9];

// Type containing things that are different for yengii
export type YengiiVariant<T> = { normal: T; yengii: T };

const sharingTable: Record<PlayerCount, YengiiVariant<number>[]> = {
  4: [
    { normal: 6, yengii: 3 },
    { normal: 5, yengii: 2 },
    { normal: 4, yengii: 2 },
    { normal: 4, yengii: 1 },
    { normal: 3, yengii: 1 },
    { normal: 2, yengii: 0 },
  ],
  5: [
    { normal: 6, yengii: 3 },
    { normal: 6, yengii: 2 },
    { normal: 5, yengii: 1 },
    { normal: 4, yengii: 1 },
    { normal: 3, yengii: 1 },
    { normal: 1, yengii: 0 },
  ],
  6: [
    { normal: 6, yengii: 3 },
    { normal: 6, yengii: 2 },
    { normal: 5, yengii: 1 },
    { normal: 4, yengii: 1 },
    { normal: 2, yengii: 0 },
    { normal: 1, yengii: 0 },
  ],
  7: [
    { normal: 7, yengii: 2 },
    { normal: 6, yengii: 2 },
    { normal: 5, yengii: 1 },
    { normal: 4, yengii: 1 },
    { normal: 2, yengii: 0 },
    { normal: 0, yengii: 0 },
  ],
  8: [
    { normal: 7, yengii: 2 },
    { normal: 6, yengii: 2 },
    { normal: 5, yengii: 1 },
    { normal: 4, yengii: 1 },
    { normal: 2, yengii: 0 },
    { normal: 0, yengii: 0 },
  ],
  9: [
    { normal: 7, yengii: 2 },
    { normal: 6, yengii: 2 },
    { normal: 5, yengii: 1 },
    { normal: 4, yengii: 1 },
    { normal: 2, yengii: 0 },
    { normal: 0, yengii: 0 },
  ],
};

export const getSharingBonuses = (
  playerCount: PlayerCount
): YengiiVariant<number>[] => sharingTable[playerCount];
