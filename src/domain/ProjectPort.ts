import { Project } from "./Project";

export interface ProjectPort {
    createProject(project: Omit<Project, "id_proyecto">): Promise<number>;
    updateProject(id_proyecto: number, project: Partial<Project>): Promise<boolean>;
    getAllProjects(): Promise<Project[]>;
    getProjectById(id_proyecto: number): Promise<Project | null>;
    deleteProject(id_proyecto: number): Promise<boolean>;
}