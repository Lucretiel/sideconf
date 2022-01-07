export type FactionID =
  | "kit"
  | "caylion"
  | "kjas"
  | "faderan"
  | "imdril"
  | "eniet"
  | "unity"
  | "yengii"
  | "zeth";

export type FactionSet = Set<FactionID>;

export type FactionData = {
  name: string;
  shorthandName: string;
};

export const allFactions: Record<FactionID, FactionData> = {
  kit: {
    name: "Kt'zr'kt'rtl",
    shorthandName: "Kit",
  },
  caylion: {
    name: "Caylion",
    shorthandName: "Caylion",
  },
  kjas: {
    name: "Kjasjavikalimm",
    shorthandName: "Kjas",
  },
  faderan: {
    name: "Faderan",
    shorthandName: "Faderan",
  },
  imdril: {
    name: "Im'dril",
    shorthandName: "Im'dril",
  },
  eniet: {
    name: "Eni      Et",
    shorthandName: "Eni Et",
  },
  unity: {
    name: "Unity",
    shorthandName: "Unity",
  },
  yengii: {
    name: "Yengii",
    shorthandName: "Yengii",
  },
  zeth: {
    name: "Zeth",
    shorthandName: "Zeth",
  },
};

export const allFactionIds: FactionID[] = [
  "kit",
  "caylion",
  "kjas",
  "faderan",
  "imdril",
  "eniet",
  "unity",
  "yengii",
  "zeth",
];

// Acceptable player counts in a Sidereal game
export type PlayerCount = 4 | 5 | 6 | 7 | 8 | 9;

// Type containing things that are different for yengii
export type YengiiVariant<T> = { normal: T; yengii: T };

const sharingTable: Record<number, YengiiVariant<number>[]> = {
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
  playerCount: number
): YengiiVariant<number>[] => {
  let value = sharingTable[playerCount];
  if (value == undefined) {
    throw new Error("Invalid player count");
  }
  return value;
};

/// The amount of time trade can last, in milliseconds
export type TradeTimeLimit = number | "unlimited";
