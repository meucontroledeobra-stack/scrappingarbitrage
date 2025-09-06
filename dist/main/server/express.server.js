"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runServer = void 0;
const envs_1 = require("../../app/envs");
const express_config_1 = require("../config/express.config");
const app_routes_1 = require("./app.routes");
function runServer() {
    const app = (0, express_config_1.createServer)();
    app.get("/", (req, res) => {
        res.status(200).json({
            ok: true,
            message: "API Bombando",
        });
    });
    (0, app_routes_1.makeRoutes)(app);
    app.listen(envs_1.appEnvs.porta, () => console.log("API esta rodando na porta " + envs_1.appEnvs.porta));
}
exports.runServer = runServer;
