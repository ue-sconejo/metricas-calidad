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

    async getAllProjects(): Promise<Project[]> {
        return await this.port.getAllProjects();
    }

    async getProjectById(id: number): Promise<Project | null> {
        return await this.port.getProjectById(id);
    }

    async updateProject(id: number, project: Partial<Project>): Promise<boolean> {
        const existingProject = await this.port.getProjectById(id);
        if (!existingProject) {
            throw new Error("El proyecto no existe");
        }

        return await this.port.updateProject(id, project);
    }

    async deleteProject(id: number): Promise<boolean> {
        const existingProject = await this.port.getProjectById(id);
        if (!existingProject) {
            throw new Error("Proyecto no encontrado");
        }

        return await this.port.deleteProject(id);
    }
}
