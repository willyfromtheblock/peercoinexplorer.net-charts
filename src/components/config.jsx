export const charts = [
  {
    name: "blocktiming",
    label: "Block timing",
    ytitle: "avg. minutes between blocks",
  },
  {
    name: "coinsupply",
    label: "Coin supply",
    ytitle: "PPC in circulation by origin",
    multi: true,
  },
  {
    name: "posdifficulty",
    label: "PoS Difficulty",
    ytitle: "avg. PoS difficulty per day",
  },
  {
    name: "powdifficulty",
    label: "PoW Difficulty",
    ytitle: "avg. PoW difficulty per day",
  },
  {
    name: "powreward",
    label: "PoW Reward",
    ytitle: "avg. PoW reward per day",
  },
  {
    name: "blockratio",
    label: "PoS/PoW block ratio",
    ytitle: "ratio of PoS to PoW blocks",
  },
  {
    name: "mintingmining",
    label: "Coins minted/mined",
    ytitle: "coins created per day",
    multi: true,
  },
  {
    name: "realtx",
    label: "Real transactions",
    ytitle: "Number of real TX per day",
    decimals: 0,
  },
  {
    name: "realvalue",
    label: "Real transaction value",
    ytitle: "Value of real TX per day (PPC)",
  },
  {
    name: "addrmintingmining",
    label: "Active addresses minting/mining",
    ytitle: "Number of active addresses per day",
    decimals: 0,
    multi: true,
  },
  {
    name: "annualinflation",
    label: "Annual inflation rate",
    ytitle: "Annual inflation rate in % per day",
    multi: true,
  },
];

export const options = [
  {
    name: "Log",
    type: "logarithmic",
  },
  {
    name: "Linear",
    type: "linear",
  },
];

export const dataGroups = [
  {
    name: "Default",
    type: "default",
  },
  {
    name: "Months",
    type: "months",
  },
  {
    name: "Weeks",
    type: "weeks",
  },
  {
    name: "Days",
    type: "days",
  },
];
