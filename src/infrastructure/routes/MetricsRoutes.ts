import { Router } from "express";
import { MetricsAdapter } from "../adapter/MetricsAdapter";
import { MetricsApplicationService } from "../../application/MetricsApplicationService";
import { MetricsController } from "../controller/MetricsController";
import { authenticateToken } from "../web/authMiddleware";

const router = Router();

const metricsAdapter = new MetricsAdapter();
const metricsApp = new MetricsApplicationService(metricsAdapter);
const metricsController = new MetricsController(metricsApp);

router.post("/", authenticateToken, async (req, res) => {
    try {
        await metricsController.createMetrics(req, res);
    } catch (error) {
        res.status(400).json({ message: "Error en creación de métrica" });
    }
});

router.get("/", authenticateToken, async (req, res) => {
    try {
        await metricsController.getAllMetrics(req, res);
    } catch (error) {
        res.status(400).json({ message: "Error al obtener métricas" });
    }
});

router.get("/:id", authenticateToken, async (req, res) => {
    try {
        await metricsController.getMetricsById(req, res);
    } catch (error) {
        res.status(400).json({ message: "Error al obtener métrica" });
    }
});

router.get("/usuario/:userId", authenticateToken, async (req, res) => {
    try {
        await metricsController.getMetricsByUserId(req, res);
    } catch (error) {
        res.status(400).json({ message: "Error al obtener métricas del usuario" });
    }
});

router.put("/:id", authenticateToken, async (req, res) => {
    try {
        await metricsController.updateMetrics(req, res);
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar métrica" });
    }
});

router.put("/delete/:id", authenticateToken, async (req, res) => {
    try {
        await metricsController.deleteMetrics(req, res);
    } catch (error) {
        res.status(400).json({ message: "Error al eliminar métrica" });
    }
});

export default router;
