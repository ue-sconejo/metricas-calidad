import express, { Response, Request } from 'express';
import userRouters from "../routes/UserRouters";
import projectRouters from "../routes/ProjectRouters";

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
    }

    getApp() {
        return this.app;
    }
}

export default new App().getApp();
