import { Request, Response } from "express";
import { ProjectApplication } from "../../application/ProjectApplicationService";
import { Project } from "../../domain/Project";

export class ProjectController {
    private app: ProjectApplication;

    constructor(app: ProjectApplication) {
        this.app = app;
    }

    async createProject(req: Request, res: Response): Promise<Response> {
        const { nombre, descripcion, fecha_inicio, fecha_fin } = req.body;

        try {
            if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3) {
                return res.status(400).json({ message: "Nombre de proyecto inválido" });
            }

            const estado = 1;
            const project: Omit<Project, "id_proyecto"> = {
                nombre,
                descripcion,
                fecha_inicio,
                fecha_fin,
                estado
            };

            const projectId = await this.app.createProject(project);
            return res.status(200).json({ message: "Proyecto creado exitosamente", projectId });

        } catch (error) {
            console.error("Error al crear proyecto:", error);
            return res.status(500).json({ message: "Error en el servidor" });
        }
    }

    async getAllProjects(req: Request, res: Response): Promise<Response> {
        try {
            const projects = await this.app.getAllProjects();
            return res.status(200).json(projects);
        } catch (error) {
            return res.status(500).json({ message: "Error al consultar proyectos" });
        }
    }

    async getProjectById(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "ID inválido" });
            }

            const project = await this.app.getProjectById(id);
            if (!project) return res.status(404).json({ message: "Proyecto no encontrado" });

            return res.status(200).json(project);

        } catch (error) {
            return res.status(500).json({ message: "Error en la consulta del proyecto" });
        }
    }

    async updateProject(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

            const { nombre, descripcion, fecha_inicio, fecha_fin } = req.body;

            const updateData: Partial<Project> = {
                nombre,
                descripcion,
                fecha_inicio,
                fecha_fin,
                estado: 1
            };

            const updated = await this.app.updateProject(id, updateData);
            if (!updated) {
                return res.status(404).json({ message: "No se pudo actualizar el proyecto" });
            }

            return res.status(200).json({ message: "Proyecto actualizado correctamente" });

        } catch (error) {
            return res.status(500).json({ message: "Error en el servidor" });
        }
    }

    async deleteProject(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });
            
            const deleted = await this.app.deleteProject(id);
            if (!deleted) {
                return res.status(404).json({ message: "Proyecto no encontrado o ya eliminado" });
            }

            return res.status(200).json({ message: "Proyecto eliminado exitosamente" });

        } catch (error) {
            return res.status(500).json({ message: "Error en el servidor" });
        }
    }
}
