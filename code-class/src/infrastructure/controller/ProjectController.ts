import { ProjectApplication } from "../../application/ProjectApplicationService";
import { Project } from "../../domain/Project";
import { Request, Response } from "express";

export class ProjectController {
    private app: ProjectApplication;

    constructor(app: ProjectApplication) {
        this.app = app;
    }

     async registerProject(req: Request, res: Response): Promise<Response> {
        const { name, description, start_date, end_date } = req.body;
        try {
            const project: Omit<Project, "id_proyecto"> = { nombre: name, descripcion: description, fecha_inicio: start_date, fecha_fin: end_date };
            const projectId = await this.app.createProject(project);
            return res.status(200).json({ message: "Exito el registrar proyecto", projectId });
        } catch (error) {
            return res.status(500).json({ messaje: "Error on server!!" });
        }

    }

    async getAllProjects(request: Request, response: Response): Promise<Response> {
        try {
            const projects = await this.app.getAllProjects();
            return response.status(200).json(projects);
        } catch (error) {
            return response.status(500).json({ message: "Error en consulta" });
        }
    }

    async getAll(req: Request, res: Response) {
        // const projects = await this.projectRepository.find();
        // res.json(projects);
    }

    async getById(req: Request, res: Response) {
        // const project = await this.projectRepository.findOneBy({ id_proyecto: Number(req.params.id) });
        // res.json(project);
    }

    async create(req: Request, res: Response) {
        // const project = this.projectRepository.create(req.body);
        // await this.projectRepository.save(project);
        // res.status(201).json(project);
    }

    async update(req: Request, res: Response) {
        // await this.projectRepository.update(req.params.id, req.body);
        res.sendStatus(204);
    }

    async delete(req: Request, res: Response) {
        // await this.projectRepository.delete(req.params.id);
        res.sendStatus(204);
    }
}