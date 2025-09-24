import { Router } from "express";
import { ProjectAdapter } from "../adapter/ProjectAdapter";
import { ProjectApplication } from "../../application/ProjectApplicationService";
import { ProjectController } from "../controller/ProjectController";
import { authenticateToken } from "../web/authMiddleware";

const router = Router();

const projectAdapter = new ProjectAdapter();
const projectApp = new ProjectApplication(projectAdapter);
const projectController = new ProjectController(projectApp);

router.post("/", authenticateToken, async (req, res) => {
    try {
        await projectController.createProject(req, res);
    } catch (error) {
        res.status(400).json({ message: "Error en creación de proyecto" });
    }
});

router.get("/", authenticateToken, async (req, res) => {
    try {
        await projectController.getAllProjects(req, res);
    } catch (error) {
        res.status(400).json({ message: "Error al obtener proyectos" });
    }
});

router.get("/:id", authenticateToken, async (req, res) => {
    try {
        await projectController.getProjectById(req, res);
    } catch (error) {
        res.status(400).json({ message: "Error al obtener proyecto" });
    }
});

router.put("/:id", authenticateToken, async (req, res) => {
    try {
        await projectController.updateProject(req, res);
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar proyecto" });
    }
});

router.put("/delete/:id", authenticateToken, async (req, res) => {
    try {
        await projectController.deleteProject(req, res);
    } catch (error) {
        res.status(400).json({ message: "Error al eliminar proyecto" });
    }
});

export default router;
