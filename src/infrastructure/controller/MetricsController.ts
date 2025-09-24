import { Request, Response } from "express";
import { MetricsApplicationService } from "../../application/MetricsApplicationService";
import { Metrics } from "../../domain/Metrics";

export class MetricsController {
    private app: MetricsApplicationService;

    constructor(app: MetricsApplicationService) {
        this.app = app;
    }

    async createMetrics(req: Request, res: Response): Promise<Response> {
        const {
            id_usuario,
            periodo,
            tareas_completadas,
            cumplimiento_tiempo,
            eficiencia,
            puntuacion_global,
            status
        } = req.body;

        try {
            if (!id_usuario || typeof id_usuario !== "number") {
                return res.status(400).json({ message: "ID de usuario inválido" });
            }

            if (!periodo || typeof periodo !== "string" || periodo.trim().length < 3) {
                return res.status(400).json({ message: "Periodo inválido" });
            }

            const metrics: Omit<Metrics, "id_metrica"> = {
                id_usuario,
                periodo,
                tareas_completadas,
                cumplimiento_tiempo,
                eficiencia,
                puntuacion_global,
                status
            };

            const metricId = await this.app.createMetrics(metrics);
            return res.status(200).json({ message: "Métrica creada exitosamente", metricId });

        } catch (error) {
            console.error("Error al crear métrica:", error);
            return res.status(500).json({ message: "Error en el servidor" });
        }
    }

    async getAllMetrics(req: Request, res: Response): Promise<Response> {
        try {
            const metrics = await this.app.getAllMetrics();
            return res.status(200).json(metrics);
        } catch (error) {
            return res.status(500).json({ message: "Error al consultar métricas" });
        }
    }

    async getMetricsById(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "ID inválido" });
            }

            const metrics = await this.app.getMetricsById(id);
            if (!metrics) return res.status(404).json({ message: "Métrica no encontrada" });

            return res.status(200).json(metrics);

        } catch (error) {
            return res.status(500).json({ message: "Error al consultar la métrica" });
        }
    }

    async updateMetrics(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

            const {
                id_usuario,
                periodo,
                tareas_completadas,
                cumplimiento_tiempo,
                eficiencia,
                puntuacion_global
            } = req.body;

            const updateData: Partial<Metrics> = {
                id_usuario,
                periodo,
                tareas_completadas,
                cumplimiento_tiempo,
                eficiencia,
                puntuacion_global
            };

            const updated = await this.app.updateMetrics(id, updateData);
            if (!updated) {
                return res.status(404).json({ message: "No se pudo actualizar la métrica" });
            }

            return res.status(200).json({ message: "Métrica actualizada correctamente" });

        } catch (error) {
            return res.status(500).json({ message: "Error en el servidor" });
        }
    }

    async deleteMetrics(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

            const deleted = await this.app.deleteMetrics(id);
            if (!deleted) {
                return res.status(404).json({ message: "Métrica no encontrada o ya eliminada" });
            }

            return res.status(200).json({ message: "Métrica eliminada exitosamente" });

        } catch (error) {
            return res.status(500).json({ message: "Error en el servidor" });
        }
    }

    async getMetricsByUserId(req: Request, res: Response): Promise<Response> {
        try {
            const userId = parseInt(req.params.userId);
            if (isNaN(userId)) return res.status(400).json({ message: "ID de usuario inválido" });

            const metricsList = await this.app.getMetricsByUserId(userId);
            return res.status(200).json(metricsList);
        } catch (error) {
            return res.status(500).json({ message: "Error al consultar métricas por usuario" });
        }
    }
}
