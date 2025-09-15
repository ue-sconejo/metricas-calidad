import { Response, Router } from "express";
import { ProjectApplication } from '../../application/ProjectApplicationService';
import { ProjectController } from "../controller/ProjectController";
import { ProjectAdapter } from "../adapter/ProjectAdapter";
import { authenticateToken } from "../web/authMiddleware";

const router = Router();

const projectAdapter = new ProjectAdapter();
const projectApp = new ProjectApplication(projectAdapter);
const projectController = new ProjectController(projectApp);

router.get("/", async (request, response) => {
    try {
        await projectController.getAllProjects(request, response);
    } catch (error) {
        response.status(400).json({ message: "Error en consulta de datos" });
    }
});

router.post("/", async (request, response) => {
    try {
        await projectController.registerProject(request, response);
    } catch (error) {
        response.status(400).json({ message: "Error en creacion de datos" });
    }
});

export default router;