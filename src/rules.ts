export type FactionId =
  | "kit"
  | "caylion"
  | "kjas"
  | "faderan"
  | "imdril"
  | "eniet"
  | "unity"
  | "yengii"
  | "zeth";

export type FactionType = "base" | "expansion";

export type FactionSet = Map<FactionId, FactionType>;

export type FactionData = {
  commonName: string;
  baseName: string;
  expansionName: string;
  shorthandName: string;
};

export const allFactions: Record<FactionId, FactionData> = {
  kit: {
    commonName: "Kt'zr'kt'rtl",
    baseName: "Kt'zr'kt'rtl Adhocracy",
    expansionName: "Kt'zr'kt'rtl Technophiles",
    shorthandName: "Kit",
  },
  caylion: {
    commonName: "Caylion",
    baseName: "Caylion Plutocracy",
    expansionName: "Caylion Collaborative",
    shorthandName: "Caylion",
  },
  kjas: {
    commonName: "Kjasjavikalimm",
    baseName: "Kjasjavikalimm Directorate",
    expansionName: "Kjasjavikalimm Independent Nations",
    shorthandName: "Kjas",
  },
  faderan: {
    commonName: "Faderan",
    baseName: "Faderan Conclave",
    expansionName: "Society of Falling Light",
    shorthandName: "Faderan",
  },
  imdril: {
    commonName: "Im'dril",
    baseName: "Im'dril Nomads",
    expansionName: "Grand Fleet",
    shorthandName: "Im'dril",
  },
  eniet: {
    commonName: "Eni Et",
    baseName: "Eni Et Ascendancy",
    expansionName: "Eni Et Engineers",
    shorthandName: "Eni Et",
  },
  unity: {
    commonName: "Unity",
    baseName: "Unity",
    expansionName: "Deep Unity",
    shorthandName: "Unity",
  },
  yengii: {
    commonName: "Yengii",
    baseName: "Yengii Society",
    expansionName: "Yengii Jii",
    shorthandName: "Yengii",
  },
  zeth: {
    commonName: "Zeth",
    baseName: "Zeth Anocracy",
    expansionName: "Charity Syndicate",
    shorthandName: "Zeth",
  },
};

export const allFactionIds = Object.keys(allFactions) as FactionId[];

export type RoundId = 1 | 2 | 3 | 4 | 5 | 6;

export const validPlayerCount = (count: number): boolean =>
  sharingTable[count] !== undefined;

// Type containing things that are different for yengii
export type YengiiVariant<T> = { normal: T; yengii: T };

const sharingTable: Record<number, Record<RoundId, YengiiVariant<number>>> = {
  4: {
    1: { normal: 6, yengii: 3 },
    2: { normal: 5, yengii: 2 },
    3: { normal: 4, yengii: 2 },
    4: { normal: 4, yengii: 1 },
    5: { normal: 3, yengii: 1 },
    6: { normal: 2, yengii: 0 },
  },
  5: {
    1: { normal: 6, yengii: 3 },
    2: { normal: 6, yengii: 2 },
    3: { normal: 5, yengii: 1 },
    4: { normal: 4, yengii: 1 },
    5: { normal: 3, yengii: 1 },
    6: { normal: 1, yengii: 0 },
  },
  6: {
    1: { normal: 6, yengii: 3 },
    2: { normal: 6, yengii: 2 },
    3: { normal: 5, yengii: 1 },
    4: { normal: 4, yengii: 1 },
    5: { normal: 2, yengii: 0 },
    6: { normal: 1, yengii: 0 },
  },
  7: {
    1: { normal: 7, yengii: 2 },
    2: { normal: 6, yengii: 2 },
    3: { normal: 5, yengii: 1 },
    4: { normal: 4, yengii: 1 },
    5: { normal: 2, yengii: 0 },
    6: { normal: 0, yengii: 0 },
  },
  8: {
    1: { normal: 7, yengii: 2 },
    2: { normal: 6, yengii: 2 },
    3: { normal: 5, yengii: 1 },
    4: { normal: 4, yengii: 1 },
    5: { normal: 2, yengii: 0 },
    6: { normal: 0, yengii: 0 },
  },
  9: {
    1: { normal: 7, yengii: 2 },
    2: { normal: 6, yengii: 2 },
    3: { normal: 5, yengii: 1 },
    4: { normal: 4, yengii: 1 },
    5: { normal: 2, yengii: 0 },
    6: { normal: 0, yengii: 0 },
  },
};

export const getSharingBonuses = (
  playerCount: number
): Record<RoundId, YengiiVariant<number>> => {
  let value = sharingTable[playerCount];
  if (value === undefined) {
    throw new Error("Invalid player count");
  }
  return value;
};

/// The amount of time trade can last, in milliseconds
export type TradeTimeLimit = number | "unlimited";

export type SubPhase = "sharing" | "bidding" | "stealing";

export type Phase =
  | {
      main: "trade" | "economy";
    }
  | {
      main: "confluence";
      subPhase: SubPhase;
    };

export type GameStep =
  | {
      phase: "scoring";
    }
  | {
      phase: Phase;
      round: RoundId;
    };

export type Transition = {
  nextRound?: boolean;
  phase: Phase;
};
