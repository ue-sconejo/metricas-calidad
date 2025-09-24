import { Request, Response } from "express";
import { ActivityApplication } from "../../application/ActivityApplicationService";
import { Activity } from "../../domain/Activity";

export class ActivityController {
    private app: ActivityApplication;

    constructor(app: ActivityApplication) {
        this.app = app;
    }

    async createActivity(req: Request, res: Response): Promise<Response> {
        const { nombre, descripcion, fecha_inicio, fecha_fin, estado, id_proyecto, tipo } = req.body;

        try {
            if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3) {
                return res.status(400).json({ message: "Nombre de actividad inválido" });
            }

            const activity: Omit<Activity, "id_actividad"> = {
                nombre,
                descripcion,
                fecha_inicio,
                fecha_fin,
                estado,
                id_proyecto,
                tipo
            };

            const activityId = await this.app.createActivity(activity);
            return res.status(200).json({ message: "Actividad creada exitosamente", activityId });

        } catch (error) {
            console.error("Error al crear actividad:", error);
            return res.status(500).json({ message: "Error en el servidor" });
        }
    }

    async getAllActivities(req: Request, res: Response): Promise<Response> {
        try {
            const activities = await this.app.getAllActivities();
            return res.status(200).json(activities);
        } catch (error) {
            return res.status(500).json({ message: "Error al consultar actividades" });
        }
    }

    async getActivityById(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "ID inválido" });
            }

            const activity = await this.app.getActivityById(id);
            if (!activity) return res.status(404).json({ message: "Actividad no encontrada" });

            return res.status(200).json(activity);

        } catch (error) {
            return res.status(500).json({ message: "Error en la consulta de la actividad" });
        }
    }

    async updateActivity(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

            const { nombre, descripcion, fecha_inicio, fecha_fin, estado, id_proyecto, tipo } = req.body;

            const updateData: Partial<Activity> = {
                nombre,
                descripcion,
                fecha_inicio,
                fecha_fin,
                estado,
                id_proyecto,
                tipo
            };

            const updated = await this.app.updateActivity(id, updateData);
            if (!updated) {
                return res.status(404).json({ message: "No se pudo actualizar la actividad" });
            }

            return res.status(200).json({ message: "Actividad actualizada correctamente" });

        } catch (error) {
            return res.status(500).json({ message: "Error en el servidor" });
        }
    }

    async deleteActivity(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

            const deleted = await this.app.deleteActivity(id);
            if (!deleted) {
                return res.status(404).json({ message: "Actividad no encontrada o ya eliminada" });
            }

            return res.status(200).json({ message: "Actividad eliminada exitosamente" });

        } catch (error) {
            return res.status(500).json({ message: "Error en el servidor" });
        }
    }

    async getActivitiesByProjectId(req: Request, res: Response): Promise<Response> {
        try {
            const projectId = parseInt(req.params.projectId);
            if (isNaN(projectId)) return res.status(400).json({ message: "ID de proyecto inválido" });

            const activities = await this.app.getActivitiesByProjectId(projectId);
            return res.status(200).json(activities);
        } catch (error) {
            return res.status(500).json({ message: "Error al consultar actividades por proyecto" });
        }
    }
}
