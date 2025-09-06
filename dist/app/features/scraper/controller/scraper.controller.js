"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperController = void 0;
const usecase_1 = require("../usecase");

class ScraperController {
  static async scraper(req, res) {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    const usecase = new usecase_1.ScraperUsecase();

    try {
      await usecase.execute((data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      });

      res.write("event: end\ndata: done\n\n");
      res.end();
    } catch (err) {
      res.write(
        `event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`
      );
      res.end();
    }
  }
}

exports.ScraperController = ScraperController;
