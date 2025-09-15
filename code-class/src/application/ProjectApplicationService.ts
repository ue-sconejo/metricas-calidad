import { Project } from "../domain/Project";
import { ProjectPort } from "../domain/ProjectPort";

export class ProjectApplication {
    private port: ProjectPort;

    constructor(port: ProjectPort) {
        this.port = port;
    }

    async createProject(project: Omit<Project, "id_proyecto">): Promise<number> {
        return await this.port.createProject(project);
    }

    async updateProject(id_proyecto: number, project: Partial<Project>): Promise<boolean> {
        const existingProject = await this.port.getProjectById(id_proyecto);

        if (!existingProject) throw new Error("El proyecto no existe");

        return await this.port.updateProject(id_proyecto, project);
    }

    async getAllProjects(): Promise<Project[]> {
        return await this.port.getAllProjects();
    }

    async getProjectById(id_proyecto: number): Promise<Project | null> {
        return await this.port.getProjectById(id_proyecto);
    }

    async deleteProject(id_proyecto: number): Promise<boolean> {
        const existingProject = await this.port.getProjectById(id_proyecto);
        if (!existingProject) {
            throw new Error("No se encontró el proyecto");
        }

        return await
            this.port.deleteProject(id_proyecto);
    }
}   