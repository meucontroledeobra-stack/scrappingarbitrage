"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapeRepository = void 0;
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(
  require("puppeteer-extra-plugin-stealth")
);
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
class ScrapeRepository {
  async scrapeFundingRates(onData) {
    const browser = await puppeteer_extra_1.default.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
      ],
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH ||
        puppeteer_extra_1.default.executablePath(),
      defaultViewport: null,
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.188 Safari/537.36"
    );
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => false });
    });
    await page.goto("https://arbitragescanner.io/pt/funding-rates", {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });
    await page.waitForSelector("._coinTitle_1vuyk_18");
    const coins = await page.$$eval(
      "._tableContainer_1vuyk_14 table tbody tr",
      (trs) =>
        trs.map((tr) => {
          const tds = Array.from(tr.querySelectorAll("td"));
          const coinName = tds[0]?.innerText.trim();
          const fundingCells = tds.slice(1).map((td) => {
            const a = td.querySelector("a");
            return a
              ? { value: a.innerText.trim(), link: a.href }
              : td.innerText.trim();
          });
          return { coinName, fundingCells };
        })
    );
    console.log("Coins capturados:", coins);
    const selectors = {
      // GATE.IO
      "gate.io": async (page) => {
        await new Promise((r) => setTimeout(r, 3000));
        await page.waitForSelector('[data-testid="tr-futures-header-price"]', {
          timeout: 15000,
        });
        await page.waitForFunction(
          () => {
            const timerDiv = document.querySelector(
              '[data-testid="futures-header-funding-rate-timer"]'
            );
            if (!timerDiv) return false;
            const span = timerDiv.querySelector(
              "span.font-add-color, span.font-dec-color"
            );
            return span && span.textContent && span.textContent.trim() !== "";
          },
          { timeout: 20000 }
        );
        return page.evaluate(() => {
          const preco =
            document.querySelector(
              '[data-testid="tr-futures-header-price"] span'
            )?.innerText || null;
          let taxa = null;
          let horario = null;
          const timerDiv = document.querySelector(
            '[data-testid="futures-header-funding-rate-timer"]'
          );
          if (timerDiv) {
            const span = timerDiv.querySelector(
              "span.font-add-color, span.font-dec-color"
            );
            if (span) {
              const parts = span.innerText.split("/");
              taxa = parts[0]?.trim() || null;
              horario = parts[1]?.trim() || null;
            }
          }
          const bids = [];
          const asks = [];
          document.querySelectorAll(".orderbook-item").forEach((row) => {
            const preco = (
              row.querySelector("div.text-decrease, div.text-increase")
                ?.textContent || ""
            ).trim();
            const spans = row.querySelectorAll("span");
            const quantidade = spans[0]?.textContent?.trim() || "";
            const acumulado = spans[1]?.textContent?.trim() || "";
            if (preco && quantidade && acumulado) {
              if (row.querySelector("div.text-increase")) {
                bids.push({ preco, quantidade, acumulado });
              } else if (row.querySelector("div.text-decrease")) {
                asks.push({ preco, quantidade, acumulado });
              }
            }
          });
          return { preco, taxa, horario, bids, asks };
        });
      },
      // MEXC
      "mexc.com": async (page) => {
        await page.setViewport({ width: 1920, height: 1080 });
        await new Promise((r) => setTimeout(r, 3000));
        try {
          // Espera que o preço seja carregado
          await page.waitForSelector("h2.contractDetail_lastPrice__bKyQo", {
            timeout: 20000,
          });
          // Rola a tabela até carregar todas as linhas
          await page.evaluate(async () => {
            const table = document.querySelector(".market_tableBody__bhNY_");
            if (!table) return;
            // Rolar devagar até o final
            let lastScroll = -1;
            while (table.scrollTop !== lastScroll) {
              lastScroll = table.scrollTop;
              table.scrollTop = table.scrollHeight;
              await new Promise((r) => setTimeout(r, 200)); // espera o conteúdo carregar
            }
          });
          return page.evaluate(() => {
            const preco =
              document.querySelector("h2.contractDetail_lastPrice__bKyQo span")
                ?.innerText || null;
            const taxaHorarioRaw =
              document.querySelector(
                ".contractDetail_fundingItem__TbJSH i.font-16"
              )?.innerText || "";
            let taxa = null;
            let horario = null;
            if (taxaHorarioRaw.includes("/")) {
              const parts = taxaHorarioRaw.split("/");
              taxa = parts[0]?.trim() || null;
              horario = parts[1]?.trim() || null;
            }
            // Bids
            const bids = Array.from(
              document.querySelectorAll(".market_bidRow__6wAE6")
            ).map((row) => ({
              preco:
                row
                  .querySelector(".market_price__V_09X.market_buy__F9O7S span")
                  ?.textContent?.trim() || "",
              quantidade:
                row.querySelector(".market_vol__M6Ton")?.textContent?.trim() ||
                "",
              acumulado:
                row
                  .querySelector(".market_amount__a1I8g")
                  ?.textContent?.trim() || "",
            }));
            // Asks
            const asks = Array.from(
              document.querySelectorAll(".market_askRow__eRJes")
            ).map((row) => ({
              preco:
                row
                  .querySelector(".market_price__V_09X.market_sell__SZ_It span")
                  ?.textContent?.trim() || "",
              quantidade:
                row.querySelector(".market_vol__M6Ton")?.textContent?.trim() ||
                "",
              acumulado:
                row
                  .querySelector(".market_amount__a1I8g")
                  ?.textContent?.trim() || "",
            }));
            return { preco, taxa, horario, bids, asks };
          });
        } catch (err) {
          console.log("MEXC erro interno:", err);
          return { preco: null, taxa: null, horario: null, bids: [], asks: [] };
        }
      },
      // BITGET
      "bitget.com": async (page) => {
        await page.setViewport({ width: 1920, height: 1080 });
        await page.evaluate(() => {
          const scrollContainer = document.scrollingElement || document.body;
          scrollContainer.scrollLeft = scrollContainer.scrollWidth;
        });
        await new Promise((r) => setTimeout(r, 3000));
        // Espera o preço aparecer
        await page.waitForFunction(
          () => {
            const priceEl = document.querySelector(
              '[data-testid="FutureOrderTableCurrentPrice"]'
            );
            return (
              priceEl &&
              priceEl.textContent &&
              priceEl.textContent.trim() !== "0.0000"
            );
          },
          { timeout: 20000 }
        );
        return page.evaluate(() => {
          const precoEl = document.querySelector(
            '[data-testid="FutureOrderTableCurrentPrice"]'
          );
          const preco = precoEl?.innerText.trim() || null;
          const taxaEl = document.querySelector(
            '[data-testid="FutureCurrentContractFundsRate"]'
          );
          const horarioEl = document.querySelector(
            '[data-testid="FutureCurrentContractFundsRateCountDown"]'
          );
          const taxa = taxaEl?.innerText.trim() || null;
          const horario = horarioEl?.innerText.trim() || null;
          const bids = [];
          let acumuladoB = 0;
          document
            .querySelectorAll('[data-testid="FutureOrderBuyList"] ul li')
            .forEach((row) => {
              const cols = row.querySelectorAll("span");
              if (cols.length >= 2) {
                const preco = cols[0].textContent?.trim() || "";
                const quantidade = cols[1].textContent?.trim() || "";
                acumuladoB += parseFloat(quantidade.replace(/,/g, "")) || 0;
                bids.push({
                  preco,
                  quantidade,
                  acumulado: acumuladoB.toString(),
                });
              }
            });
          const asks = [];
          let acumuladoA = 0;
          document
            .querySelectorAll('[data-testid="FutureOrderSellList"] ul li')
            .forEach((row) => {
              const cols = row.querySelectorAll("span");
              if (cols.length >= 2) {
                const preco = cols[0].textContent?.trim() || "";
                const quantidade = cols[1].textContent?.trim() || "";
                acumuladoA += parseFloat(quantidade.replace(/,/g, "")) || 0;
                asks.push({
                  preco,
                  quantidade,
                  acumulado: acumuladoA.toString(),
                });
              }
            });
          return { preco, taxa, horario, bids, asks };
        });
      },
      // BYBIT
      "bybit.com": async (page) => {
        await page.setViewport({ width: 1920, height: 1080 });
        await new Promise((r) => setTimeout(r, 3000));
        // Espera carregar o preço de mercado
        await page.waitForSelector(".ob__market-price", { timeout: 15000 });
        return page.evaluate(() => {
          const precoEl = document.querySelector(".ob__market-price");
          const preco = precoEl?.textContent?.trim() || null;
          // Taxa / horário (se existir)
          const rateEl = document.querySelector(
            "div.pnr__item.pnr__funding-rate-fixed span.pnr__brand"
          );
          let taxa = rateEl?.textContent?.trim() || null;
          let horario = null;
          const timerText =
            rateEl?.parentElement?.nextElementSibling?.textContent || "";
          if (timerText.includes("/")) {
            horario = timerText.split("/")[1].trim();
          }
          // Função auxiliar para processar order book
          const processOrders = (selector) => {
            const rows = Array.from(document.querySelectorAll(selector));
            let acumulado = 0;
            return rows.map((row) => {
              const preco =
                row
                  .querySelector(".ob__table-price div")
                  ?.textContent?.trim() || "";
              const quantidade =
                row.querySelector(".ob__table-qty")?.textContent?.trim() || "";
              acumulado += parseFloat(quantidade.replace(/,/g, "")) || 0;
              return { preco, quantidade, acumulado: acumulado.toString() };
            });
          };
          const bids = processOrders(".ob__table-buy .ob__table-row");
          const asks = processOrders(".ob__table-sell .ob__table-row");
          return { preco, taxa, horario, bids, asks };
        });
      },
      // KUCOIN
      "kucoin.com": async (page) => {
        await page.setViewport({ width: 1920, height: 1080 });
        await page.waitForSelector("div.KuxDialog-body", { timeout: 10000 });
        await page.click("div.KuxDialog-body button.KuxButton-root");
        await new Promise((r) => setTimeout(r, 3000));
        await page.waitForSelector("div.hover_K1heJ", { timeout: 15000 });
        await page.waitForSelector(".orderBook_znUTV", { timeout: 15000 });
        return page.evaluate(() => {
          let preco = null;
          let taxa = null;
          let horario = null;
          // Extrair Mark Price, Funding Rate, Funding Settlement
          const items = Array.from(
            document.querySelectorAll("div.hover_K1heJ")
          );
          items.forEach((item) => {
            const title = item
              .querySelector("span.title_ea1ej, div.title_ea1ej")
              ?.textContent?.trim();
            if (!title) return;
            switch (title) {
              case "Mark Price":
                preco =
                  item.querySelector("div.value_R8fIA")?.textContent?.trim() ||
                  null;
                break;
              case "Funding Rate":
                taxa =
                  item
                    .querySelector("div.value_R8fIA span.changeRate")
                    ?.textContent?.trim() || null;
                break;
              case "Funding Settlement":
                horario =
                  item
                    .querySelector(
                      "div.value_R8fIA span.ant-statistic-content-value"
                    )
                    ?.textContent?.trim() || null;
                break;
            }
          });
          // Função para extrair bids ou asks do order book
          const parseOrders = (selector, priceClass) => {
            const orders = [];
            let acumulado = 0;
            const rows = document.querySelectorAll(
              `${selector} .orderRow_DYAUi`
            );
            rows.forEach((row) => {
              const preco =
                row.querySelector(`.${priceClass}`)?.textContent?.trim() || "";
              const quantidadeStr =
                row.querySelector(".size_hAIQj")?.textContent?.trim() || "0";
              let quantidade =
                parseFloat(
                  quantidadeStr.replace(/K/, "000").replace(/,/g, "")
                ) || 0;
              acumulado += quantidade;
              orders.push({
                preco,
                quantidade: quantidadeStr,
                acumulado: acumulado.toLocaleString("en-US", {
                  maximumFractionDigits: 3,
                }),
              });
            });
            return orders;
          };
          const asks = parseOrders(
            ".ku-orderBook.book_XWMLV:first-of-type",
            "sell_gyttN"
          );
          const bids = parseOrders(
            ".ku-orderBook.book_XWMLV:last-of-type",
            "buy_tfgD8"
          );
          return {
            preco: preco || "0",
            taxa,
            horario,
            bids,
            asks,
          };
        });
      },
      //LBANK
      "lbank.com": async (page) => {
        await page.setViewport({ width: 1920, height: 1080 });
        await new Promise((r) => setTimeout(r, 3000));
        await page.waitForSelector("ul.item", { timeout: 20000 });
        await page.waitForSelector(".orderlist.asks ul.orderlist_content", {
          timeout: 20000,
        });
        await page.waitForSelector(".orderlist.bids ul.orderlist_content", {
          timeout: 20000,
        });
        return page.evaluate(() => {
          let preco = null;
          let taxa = null;
          let horario = null;
          // ---- Preço, taxa, horário ----
          const items = Array.from(document.querySelectorAll("ul.item"));
          for (const item of items) {
            const label =
              item.querySelector("li.label")?.textContent?.trim() || "";
            const value =
              item.querySelector("li.value")?.textContent?.trim() ||
              item.querySelector("li.value div")?.textContent?.trim() ||
              "";
            if (
              label.includes("Index Price") ||
              label.includes("Preço do Índice")
            ) {
              preco = value;
            }
            if (label.includes("Funding") || label.includes("Financiamento")) {
              taxa =
                item.querySelector("li.value div")?.textContent?.trim() || null;
              const countdown =
                item
                  .querySelector("li.value span:last-child")
                  ?.textContent?.trim() || null;
              if (countdown) horario = countdown.replace("/", "").trim();
            }
          }
          // ---- Função para extrair ordens ----
          const parseOrders = (selector) => {
            const orders = [];
            document.querySelectorAll(`${selector} li.row`).forEach((row) => {
              const preco =
                row.querySelector("span.price")?.textContent?.trim() || "";
              const quantidade =
                row.querySelector("span.amount")?.textContent?.trim() || "";
              const acumulado =
                row.querySelector("span.sum")?.textContent?.trim() || "";
              orders.push({ preco, quantidade, acumulado });
            });
            return orders;
          };
          const asks = parseOrders(".orderlist.asks ul.orderlist_content");
          const bids = parseOrders(".orderlist.bids ul.orderlist_content");
          return {
            preco: preco || "0",
            taxa: taxa || null,
            horario: horario || null,
            asks,
            bids,
          };
        });
      },
      "binance.com": async (page) => {
        try {
          await page.setViewport({ width: 1920, height: 1080 });
          await new Promise((r) => setTimeout(r, 3000));
          // Fecha modal de aviso se existir
          try {
            const warningModal = await page.waitForSelector("div.css-1u2pn8e", {
              timeout: 8000,
            });
            if (warningModal) {
              const button = await warningModal.$("button.css-q6h15d");
              if (button) await button.click();
              await page.waitForSelector("div.css-1u2pn8e", {
                hidden: true,
                timeout: 5000,
              });
            }
          } catch {}
          // Aceita cookies se aparecer
          try {
            const cookieBanner = await page.waitForSelector(
              "#onetrust-banner-sdk",
              {
                timeout: 8000,
              }
            );
            if (cookieBanner) {
              const acceptButton = await cookieBanner.$(
                "#onetrust-accept-btn-handler"
              );
              if (acceptButton) await acceptButton.click();
              await page.waitForSelector("#onetrust-banner-sdk", {
                hidden: true,
                timeout: 5000,
              });
            }
          } catch {}
          // Espera o bloco do orderbook carregar
          await page.waitForSelector("div.orderbook-list", { timeout: 30000 });
          return page.evaluate(() => {
            let preco = null;
            let taxa = null;
            let horario = null;
            // --- Preço atual (marcado no topo do orderbook) ---
            preco =
              document
                .querySelector(".orderbook-ticker .contractPrice div")
                ?.textContent?.trim() || null;
            // --- Funding Rate + Countdown ---
            const fundingBlock = Array.from(
              document.querySelectorAll("div.ticker-market-list div")
            ).find((el) => el.textContent?.includes("Funding"));
            if (fundingBlock) {
              const text = fundingBlock.textContent || "";
              const percMatch = text.match(/-?\d+(\.\d+)?%/);
              const timeMatch = text.match(/\d{2}:\d{2}:\d{2}/);
              taxa = percMatch ? percMatch[0] : null;
              horario = timeMatch ? timeMatch[0] : null;
            }
            // --- Extrator de ordens ---
            const parseOrders = (selector) => {
              const rows = [];
              document
                .querySelectorAll(`${selector} .orderbook-progress`)
                .forEach((row) => {
                  const parts = row.querySelectorAll(
                    ".row-content .text, .row-content .ask-light, .row-content .bid-light"
                  );
                  if (parts.length >= 3) {
                    const preco = parts[0].textContent?.trim() || "";
                    const quantidade = parts[1].textContent?.trim() || "";
                    const acumulado = parts[2].textContent?.trim() || "";
                    rows.push({ preco, quantidade, acumulado });
                  }
                });
              return rows;
            };
            const asks = parseOrders(".orderbook-ask");
            const bids = parseOrders(".orderbook-bid");
            return {
              preco: preco || "0",
              taxa: taxa,
              horario: horario,
              asks,
              bids,
            };
          });
        } catch {
          return { preco: null, taxa: null, horario: null, asks: [], bids: [] };
        }
      },
      // BINGX
      "bingx.com": async (page) => {
        await page.setViewport({ width: 1920, height: 1080 });
        await new Promise((r) => setTimeout(r, 3000));
        await page.waitForSelector("div.quote-info.scroll", { timeout: 15000 });
        await page.waitForSelector(".asks-container, .bids-container", {
          timeout: 15000,
        });
        return page.evaluate(() => {
          let preco = null;
          let taxa = null;
          let horario = null;
          // --- Preço (Mark Price) ---
          preco =
            document.querySelector(".mark-price")?.textContent?.trim() ||
            document
              .querySelector(".ticker-container .ticker")
              ?.textContent?.trim() ||
            null;
          // --- Funding Rate + Countdown ---
          const blocks = Array.from(
            document.querySelectorAll("div.quote-block")
          );
          blocks.forEach((block) => {
            const title =
              block.querySelector("div.title")?.textContent?.trim() || "";
            const value =
              block.querySelector("div.rtl-text.value")?.textContent?.trim() ||
              "";
            if (title.includes("Funding/Countdown")) {
              const parts = value.split("/").map((p) => p.trim());
              taxa = parts[0] || null;
              horario = parts[1] || null;
            }
          });
          // --- Extrator de ordens ---
          const parseOrders = (selector) => {
            const rows = [];
            document
              .querySelectorAll(`${selector} .depth-item`)
              .forEach((row) => {
                const price =
                  row.querySelector(".depth-price")?.textContent?.trim() || "";
                const vols = Array.from(
                  row.querySelectorAll(".depth-volume")
                ).map((v) => v.textContent?.trim() || "");
                if (vols.length >= 2) {
                  rows.push({
                    preco: price,
                    quantidade: vols[0],
                    acumulado: vols[1],
                  });
                }
              });
            return rows;
          };
          const asks = parseOrders(".asks-container");
          const bids = parseOrders(".bids-container");
          return {
            preco: preco || "0",
            taxa,
            horario,
            asks,
            bids,
          };
        });
      },
      // BITMART DERIVATIVES
      "derivatives.bitmart.com": async (page) => {
        await page.setViewport({ width: 1920, height: 1080 });
        await new Promise((r) => setTimeout(r, 3000));
        // Espera os blocos principais e o orderbook
        await page.waitForSelector("div._8yAOs7", { timeout: 15000 });
        await page.waitForSelector("div.pC6yWW", { timeout: 15000 });
        return page.evaluate(() => {
          let preco = null;
          let taxa = null;
          let horario = null;
          // Extrair preço, taxa e horário
          const blocks = Array.from(
            document.querySelectorAll("div._8yAOs7 div.yTl7gX")
          );
          blocks.forEach((block) => {
            const label =
              block.querySelector("span.BSAKJA")?.textContent?.trim() || "";
            const values = Array.from(block.querySelectorAll("em.xFoJDh")).map(
              (v) => v.textContent?.trim() || ""
            );
            if (label.includes("Index")) {
              preco = values[0] || null;
            }
            if (label.includes("Funding Rate") || label.includes("Countdown")) {
              taxa = values[0] || null;
              horario = values[1] ? values[1].replace("/", "").trim() : null;
            }
          });
          // Função para extrair asks/bids
          const parseOrders = (selector, type) => {
            const orders = [];
            let acumulado = 0;
            const rows = document.querySelectorAll(
              `${selector} .K7gXn8[buy-or-sell="${type}"]`
            );
            rows.forEach((row) => {
              const preco =
                row.querySelector("span.DFlhh1")?.textContent?.trim() || "";
              const quantidadeStr =
                row.querySelectorAll("span.YFFhx2")[0]?.textContent?.trim() ||
                "0";
              const quantidade =
                parseFloat(quantidadeStr.replace(/,/g, "")) || 0;
              acumulado += quantidade;
              orders.push({
                preco,
                quantidade: quantidadeStr,
                acumulado: acumulado.toLocaleString("en-US", {
                  maximumFractionDigits: 3,
                }),
              });
            });
            return orders;
          };
          const asks = parseOrders(".pC6yWW", "sell");
          const bids = parseOrders(".pC6yWW", "buy");
          return {
            preco: preco || "0",
            taxa,
            horario,
            asks,
            bids,
          };
        });
      },
      // BLOFIN
      "blofin.com": async (page) => {
        await page.setViewport({ width: 1920, height: 1080 });
        await new Promise((r) => setTimeout(r, 3000));
        // Espera carregar o preço principal
        await page.waitForSelector("div.OrderBook_last-price__oxD8C", {
          timeout: 15000,
        });
        return page.evaluate(() => {
          const precoEl = document.querySelector(
            "div.OrderBook_last-price__oxD8C"
          );
          const preco = precoEl?.textContent?.trim() || null;
          // Funding / Countdown
          let taxa = null;
          let horario = null;
          const fundingLi = Array.from(document.querySelectorAll("li")).find(
            (li) => li.textContent?.includes("Funding Rate / Countdown")
          );
          if (fundingLi) {
            const text =
              fundingLi.querySelector("span:last-child")?.textContent || "";
            const percMatch = text.match(/[-+]?\d+(\.\d+)?%/);
            const timeMatch = text.match(/\d{2}:\d{2}:\d{2}/);
            taxa = percMatch ? percMatch[0] : null;
            horario = timeMatch ? timeMatch[0] : null;
          }
          // Função auxiliar para processar order book
          const processOrders = (selector) => {
            const rows = Array.from(document.querySelectorAll(selector));
            let acumulado = 0;
            return rows.map((row) => {
              const spans = row.querySelectorAll("span");
              const preco = spans[0]?.textContent?.trim() || "";
              const quantidade =
                spans[1]?.textContent?.trim().replace("K", "000") || "";
              acumulado += parseFloat(quantidade.replace(/,/g, "")) || 0;
              return { preco, quantidade, acumulado: acumulado.toString() };
            });
          };
          const bids = processOrders("li.OrderBook_buy__gca2t");
          const asks = processOrders("li.OrderBook_sell__Ui3iD");
          return { preco, taxa, horario, bids, asks };
        });
      },
      // COINEX
      "coinex.com": async (page) => {
        await page.setViewport({ width: 1920, height: 1080 });
        await new Promise((r) => setTimeout(r, 3000));
        await page.waitForSelector(".c-futures-orderbook-list-body", {
          timeout: 20000,
        });
        return page.evaluate(() => {
          let preco = null;
          let taxa = null;
          let horario = null;
          const txt = (el) => el?.textContent?.trim() || null;
          // -------------------------
          // Preço (último ou Mark)
          // -------------------------
          preco =
            txt(document.querySelector(".last-price-wrap .last-price span")) ||
            txt(
              document.querySelector(".sign-price-wrap .c-common-sub-num span")
            );
          // -------------------------
          // Funding (taxa + horário)
          // -------------------------
          const fundingFlex = document.querySelector(".via-ticker-item.flex");
          if (fundingFlex) {
            const leftRate =
              fundingFlex.querySelector(
                ".ticker-item.pe-2.text-end .text span.rtl\\:unicode-plain"
              ) ||
              fundingFlex.querySelector(
                ".ticker-item.pe-2.text-end .text span"
              );
            taxa = txt(leftRate);
            const rightCountdown = fundingFlex.querySelector(
              ".ticker-item.ps-2.text-start .text span"
            );
            horario = txt(rightCountdown);
          }
          // -------------------------
          // Orderbook (asks e bids)
          // -------------------------
          const asks = Array.from(
            document.querySelectorAll(".list-item.sell")
          ).map((el) => {
            const preco =
              txt(el.querySelector(".td-item:nth-child(1) span span")) || "0";
            const quantidade =
              txt(el.querySelector(".td-item:nth-child(2) span span")) || "0";
            const acumulado =
              txt(el.querySelector(".td-item:nth-child(3) span span")) || "0";
            return { preco, quantidade, acumulado };
          });
          const bids = Array.from(
            document.querySelectorAll(".list-item.buy")
          ).map((el) => {
            const preco =
              txt(el.querySelector(".td-item:nth-child(1) span span")) || "0";
            const quantidade =
              txt(el.querySelector(".td-item:nth-child(2) span span")) || "0";
            const acumulado =
              txt(el.querySelector(".td-item:nth-child(3) span span")) || "0";
            return { preco, quantidade, acumulado };
          });
          return { preco: preco || "0", taxa, horario, asks, bids };
        });
      },
      // HYPERLIQUID
      "app.hyperliquid.xyz": async (page) => {
        await page.setViewport({ width: 1920, height: 1080 });
        await new Promise((r) => setTimeout(r, 3000));
        // espera o orderbook renderizar
        await page.waitForSelector("div[style*='display: grid']", {
          timeout: 20000,
        });
        return page.evaluate(() => {
          const txt = (el) => el?.textContent?.trim() || "0";
          let preco = null;
          let taxa = null;
          let horario = null;
          // -------------------------
          // Info geral (preço, funding)
          // -------------------------
          const items = Array.from(
            document.querySelectorAll("div.futures_header_infolist ul.item")
          );
          items.forEach((item) => {
            const label = item.querySelector("li.label")?.textContent?.trim();
            const value = item.querySelector("li.value")?.textContent?.trim();
            if (!label) return;
            switch (true) {
              case label.includes("Index Price"):
                preco = value || null;
                break;
              case label.includes("Funding"):
                const fullText =
                  item.querySelector("li.value")?.textContent || "";
                const percMatch = fullText.match(/-?\d+(\.\d+)?%/);
                const timeMatch =
                  fullText.match(/\d{2}:\d{2}:\d{2}/) ||
                  fullText.match(/\d{2}:\d{2}/);
                taxa = percMatch ? percMatch[0] : null;
                horario = timeMatch ? timeMatch[0] : null;
                break;
            }
          });
          // -------------------------
          // Orderbook (asks e bids)
          // -------------------------
          const rows = Array.from(
            document.querySelectorAll("div[style*='display: grid']")
          );
          const asks = [];
          const bids = [];
          rows.forEach((row) => {
            const bg =
              row
                .querySelector("div[style*='background-color']")
                ?.getAttribute("style") || "";
            const precoVal = txt(row.querySelector("div:nth-child(1) > div"));
            const quantidadeVal = txt(
              row.querySelector("div:nth-child(2) > div")
            );
            const acumuladoVal = txt(
              row.querySelector("div:nth-child(3) > div")
            );
            if (bg.includes("rgb(237, 112, 136)")) {
              asks.push({
                preco: precoVal,
                quantidade: quantidadeVal,
                acumulado: acumuladoVal,
              });
            } else if (bg.includes("rgb(31, 166, 125)")) {
              bids.push({
                preco: precoVal,
                quantidade: quantidadeVal,
                acumulado: acumuladoVal,
              });
            }
          });
          return { preco: preco || "0", taxa, horario, asks, bids };
        });
      },
    };

    for (const coin of coins) {
      for (const cell of coin.fundingCells) {
        if (typeof cell === "object" && "link" in cell) {
          let detailPage;
          try {
            detailPage = await browser.newPage();
            await detailPage.setUserAgent(
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.188 Safari/537.36"
            );
            await detailPage.evaluateOnNewDocument(() => {
              Object.defineProperty(navigator, "webdriver", {
                get: () => false,
              });
            });

            await detailPage.goto(cell.link, {
              waitUntil: "domcontentloaded",
              timeout: 40000,
            });
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const host = new URL(cell.link).hostname.replace("www.", "");
            const extractor = Object.entries(selectors).find(([domain]) =>
              host.includes(domain)
            )?.[1];

            let result;
            if (extractor) {
              result = await extractor(detailPage);
            } else {
              result = {
                preco: null,
                taxa: null,
                horario: null,
                bids: [],
                asks: [],
              };
            }

            if (onData)
              onData({ coin: coin.coinName, link: cell.link, ...result });
          } catch (err) {
            if (onData)
              onData({
                coin: coin.coinName,
                link: cell.link,
                preco: null,
                taxa: null,
                horario: null,
                bids: [],
                asks: [],
              });
          } finally {
            if (detailPage) await detailPage.close();
          }
        }
      }
    }

    await browser.close();
  }
}
exports.ScrapeRepository = ScrapeRepository;
