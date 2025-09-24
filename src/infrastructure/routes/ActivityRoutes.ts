import { Router } from "express";
import { ActivityAdapter } from "../adapter/ActivityAdapter";
import { ActivityApplication } from "../../application/ActivityApplicationService";
import { ActivityController } from "../controller/ActivityController";
import { authenticateToken } from "../web/authMiddleware";

const router = Router();

const activityAdapter = new ActivityAdapter();
const activityApp = new ActivityApplication(activityAdapter);
const activityController = new ActivityController(activityApp);

router.post("/", authenticateToken, async (req, res) => {
    try {
        await activityController.createActivity(req, res);
    } catch (error) {
        res.status(400).json({ message: "Error en creación de actividad" });
    }
});

router.get("/", authenticateToken, async (req, res) => {
    try {
        await activityController.getAllActivities(req, res);
    } catch (error) {
        res.status(400).json({ message: "Error al obtener actividades" });
    }
});

router.get("/:id", authenticateToken, async (req, res) => {
    try {
        await activityController.getActivityById(req, res);
    } catch (error) {
        res.status(400).json({ message: "Error al obtener actividad" });
    }
});

router.get("/proyecto/:projectId", authenticateToken, async (req, res) => {
    try {
        await activityController.getActivitiesByProjectId(req, res);
    } catch (error) {
        res.status(400).json({ message: "Error al obtener actividades por proyecto" });
    }
});

router.put("/:id", authenticateToken, async (req, res) => {
    try {
        await activityController.updateActivity(req, res);
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar actividad" });
    }
});

router.put("/delete/:id", authenticateToken, async (req, res) => {
    try {
        await activityController.deleteActivity(req, res);
    } catch (error) {
        res.status(400).json({ message: "Error al eliminar actividad" });
    }
});

export default router;
