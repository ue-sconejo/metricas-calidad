import express, { Response, Request } from 'express';
import userRouters from "../routes/UserRouters";
import projectRouters from "../routes/ProjectRouters";
import activityRouters from "../routes/ActivityRoutes";
import metricsRouters from "../routes/MetricsRoutes";

import cors from 'cors';

class App {
    private app!: express.Application;

    constructor() {
        this.app = express();
        this.middleware();
        this.routes();
    }

    private middleware(): void {
        this.app.use(cors());
        this.app.use(express.json());
    }

    private routes(): void {
        this.app.use("/users", userRouters);
        this.app.use("/projects", projectRouters);
        this.app.use("/activity", activityRouters);
        this.app.use("/metrics", metricsRouters);
    }

    getApp() {
        return this.app;
    }
}

export default new App().getApp();
