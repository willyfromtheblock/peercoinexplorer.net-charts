describe("Cookie and Initial", function () {
  it("Visit peercoinexplorer.net/charts", function () {
    cy.visit("http://localhost:3000/");
    cy.contains("Please select a chart to load.");
  });
});

describe("Every Chart", () => {
  it("Block timing", () => {
    cy.contains("Block timing").click();
    cy.contains("2012-08-13");
  });
  it("Coin Supply", () => {
    cy.contains("Coin supply").click();
    cy.contains("2012-08-13");
  });
  it("PoS Difficulty", () => {
    cy.contains("PoS Difficulty").click();
    cy.contains("2012-09-17");
  });
  it("PoW Difficulty", () => {
    cy.contains("PoW Difficulty").click();
    cy.contains("2012-08-13");
  });
  it("PoS/PoW block ratio", () => {
    cy.contains("PoS/PoW block ratio").click();
    cy.contains("2012-08-13");
  });
  it("Coins minted/mined", () => {
    cy.contains("Coins minted/mined").click();
    cy.contains("2012-08-13");
  });
  it("Real transactions", () => {
    cy.contains("Real transactions").click();
    cy.contains("2012-08-13");
  });
  it("Real transaction value", () => {
    cy.contains("Real transaction value").click();
    cy.contains("2012-08-13");
  });
  it("Active addresses minting/mining", () => {
    cy.contains("Active addresses minting/mining").click();
    cy.contains("2012-08-13");
  });
  it("Annual inflation rate", () => {
    cy.contains("Annual inflation rate").click();
    cy.contains("2013-08-19");
  });
});

describe("Log/Linear", () => {
  it("Log", () => {
    cy.contains("Log").click();
  });
  it("Linear", () => {
    cy.contains("Linear").click();
  });
});

describe("Data Grouping", () => {
  it("Months", () => {
    cy.contains("Months").click();
  });
  it("Weeks", () => {
    cy.contains("Weeks").click();
  });
  it("Days", () => {
    cy.contains("Days").click();
  });
  it("Default", () => {
    cy.contains("Default").click();
  });
});

describe("Highcharts Zoom", () => {
  it("1m", () => {
    cy.contains("1m").click();
  });
  it("3m", () => {
    cy.contains("3m").click();
  });
  it("6m", () => {
    cy.contains("6m").click();
  });
  it("YTD", () => {
    cy.contains("YTD").click();
  });
  it("1y", () => {
    cy.contains("1y").click();
  });
  it("All", () => {
    cy.contains("All").click();
  });
});

describe("Donation Modal", () => {
  it("Open Modal", () => {
    cy.contains("PM7jjBUPjzpkZy1UZtD7mvmHoXJ2BGvbx9").click();
    cy.contains("Donation address");
    cy.get(".modal-content").should("exist");
  });
  it("Close Modal", () => {
    cy.contains("Close").click();
    cy.get(".modal-content").should("not.exist");
  });
});
