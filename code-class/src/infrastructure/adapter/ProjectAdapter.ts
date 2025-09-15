import { Repository } from "typeorm";
import { Project } from "../../domain/Project";
import { ProjectPort } from "../../domain/ProjectPort";
import { ProjectEntity } from "../entities/ProjectEntity";
import { AppDataSource } from "../config/data-base";

export class ProjectAdapter implements ProjectPort {

    private projectRepository: Repository<ProjectEntity>;

    constructor() {
        this.projectRepository = AppDataSource.getRepository(ProjectEntity);
    }

    private toDomain(project: ProjectEntity): Project {
        return {
            id_proyecto: project.id_proyecto,
            nombre: project.nombre,
            descripcion: project.descripcion,
            fecha_inicio: project.fecha_inicio,
            fecha_fin: project.fecha_fin,
            estado: project.estado !== undefined ? Number(project.estado) : undefined
        };
    }

    private toEntity(project: Omit<Project, 'id_proyecto'>): ProjectEntity {
        const projectEntity = new ProjectEntity();
        projectEntity.nombre = project.nombre;
        projectEntity.descripcion = project.descripcion;
        projectEntity.fecha_inicio = project.fecha_inicio;
        projectEntity.fecha_fin = project.fecha_fin;
        return projectEntity;
    }

    async createProject(project: Omit<Project, "id_proyecto">): Promise<number> {
        try {
            const newProject = this.toEntity(project);
            const savedProject = await this.projectRepository.save(newProject);
            return savedProject.id_proyecto;
        } catch (error) {
            console.error('Error on create project', error);
            throw new Error("Error on create project");
        }
    }

    async updateProject(id_proyecto: number, project: Partial<Project>): Promise<boolean> {
        try {
            const existingProject = await this.projectRepository.findOneBy({ id_proyecto });

            if (!existingProject) {
                throw new Error(`Project with ID ${id_proyecto} not found`);
            }

            if (project.nombre !== undefined) existingProject.nombre = project.nombre;
            if (project.descripcion !== undefined) existingProject.descripcion = project.descripcion;
            if (project.fecha_inicio !== undefined) existingProject.fecha_inicio = project.fecha_inicio;
            if (project.fecha_fin !== undefined) existingProject.fecha_fin = project.fecha_fin;

            await this.projectRepository.save(existingProject);

            return true;
        } catch (error) {
            console.error('Error on update project', error);
            return false;
        }
    }

    async deleteProject(id_proyecto: number): Promise<boolean> {
        try {
            const existingProject = await this.projectRepository.findOneBy({ id_proyecto });

            if (!existingProject) {
                throw new Error(`Project with ID ${id_proyecto} not found`);
            }

            await this.projectRepository.delete(id_proyecto);
            return true;
        } catch (error) {
            console.error('Error on delete project', error);
            return false;
        }
    }

    async getAllProjects(): Promise<Project[]> {
        try {
            const projects = await this.projectRepository.find();
            return projects.map(this.toDomain);
        } catch (error) {
            console.error('Error on get projects', error);
            throw new Error("Error on get projects");
        }
    }

    async getProjectById(id_proyecto: number): Promise<Project | null> {
        try {
            const project = await this.projectRepository.findOne({ where: { id_proyecto } });
            return project ? this.toDomain(project) : null;
        } catch (error) {
            console.error('Error on get project by id', error);
            throw new Error("Error on get project by id");
        }
    }
}       