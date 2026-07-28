const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let grandTotal = 0;

  for (let seed = 14; seed <= 23; seed++) {
    const url =
      `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`;

    console.log(`Opening seed ${seed}`);

    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForSelector("table");

    const numbers = await page.locator("table td").evaluateAll(cells =>
      cells.flatMap(cell => {
        const matches =
          cell.textContent.trim().match(/-?\d+(?:\.\d+)?/g);

        return matches ? matches.map(Number) : [];
      })
    );

    const seedTotal =
      numbers.reduce((sum, number) => sum + number, 0);

    console.log(`Seed ${seed} sum: ${seedTotal}`);

    grandTotal += seedTotal;
  }

  console.log("======================");
  console.log(`TOTAL SUM: ${grandTotal}`);
  console.log("======================");

  await browser.close();
})().catch(error => {
  console.error(error);
  process.exit(1);
});
