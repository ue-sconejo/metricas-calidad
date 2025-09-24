import { Repository } from "typeorm";
import { Activity } from "../../domain/Activity";
import { ActivityPort } from "../../domain/ActivityPort";
import { ActivityEntity } from "../entities/ActivityEntity";
import { AppDataSource } from "../config/data-base";

export class ActivityAdapter implements ActivityPort {
    private activityRepository: Repository<ActivityEntity>;

    constructor() {
        this.activityRepository = AppDataSource.getRepository(ActivityEntity);
    }

    private toDomain(activity: ActivityEntity): Activity {
        return {
            id_actividad: activity.id_actividad,
            nombre: activity.nombre,
            descripcion: activity.descripcion,
            fecha_inicio: activity.fecha_inicio,
            fecha_fin: activity.fecha_fin,
            estado: activity.estado,
            id_proyecto: activity.id_proyecto,
            tipo: activity.tipo
        };
    }

    private toEntity(activity: Omit<Activity, "id_actividad">): ActivityEntity {
        const entity = new ActivityEntity();
        entity.nombre = activity.nombre;
        entity.descripcion = activity.descripcion;
        entity.fecha_inicio = activity.fecha_inicio;
        entity.fecha_fin = activity.fecha_fin;
        entity.estado = activity.estado;
        entity.id_proyecto = activity.id_proyecto;
        entity.tipo = activity.tipo;
        return entity;
    }

    async createActivity(activity: Omit<Activity, "id_actividad">): Promise<number> {
        try {
            const newActivity = this.toEntity(activity);
            const saved = await this.activityRepository.save(newActivity);
            return saved.id_actividad;
        } catch (error) {
            console.error("Error on create activity", error);
            throw new Error("Error on create activity");
        }
    }

    async updateActivity(id: number, activity: Partial<Activity>): Promise<boolean> {
        try {
            const existing = await this.activityRepository.findOneBy({ id_actividad: id });
            if (!existing) throw new Error(`Activity with ID ${id} not found`);

            if (activity.nombre !== undefined) existing.nombre = activity.nombre;
            if (activity.descripcion !== undefined) existing.descripcion = activity.descripcion;
            if (activity.fecha_inicio !== undefined) existing.fecha_inicio = activity.fecha_inicio;
            if (activity.fecha_fin !== undefined) existing.fecha_fin = activity.fecha_fin;
            if (activity.estado !== undefined) existing.estado = activity.estado;
            if (activity.id_proyecto !== undefined) existing.id_proyecto = activity.id_proyecto;
            if (activity.tipo !== undefined) existing.tipo = activity.tipo;

            await this.activityRepository.save(existing);
            return true;
        } catch (error) {
            console.error("Error on update activity", error);
            return false;
        }
    }

    async deleteActivity(id: number): Promise<boolean> {
        try {
            const existing = await this.activityRepository.findOneBy({ id_actividad: id });
            if (!existing) throw new Error(`Activity with ID ${id} not found`);
            await this.activityRepository.delete(id);
            return true;
        } catch (error) {
            console.error("Error on delete activity", error);
            return false;
        }
    }

    async getAllActivities(): Promise<Activity[]> {
        try {
            const activities = await this.activityRepository.find();
            return activities.map(this.toDomain);
        } catch (error) {
            console.error("Error on get all activities", error);
            throw new Error("Error on get all activities");
        }
    }

    async getActivityById(id: number): Promise<Activity | null> {
        try {
            const activity = await this.activityRepository.findOne({ where: { id_actividad: id } });
            return activity ? this.toDomain(activity) : null;
        } catch (error) {
            console.error("Error on get activity by id", error);
            throw new Error("Error on get activity by id");
        }
    }

    async getActivitiesByProjectId(projectId: number): Promise<Activity[]> {
        try {
            const activities = await this.activityRepository.find({ where: { id_proyecto: projectId } });
            return activities.map(this.toDomain);
        } catch (error) {
            console.error("Error on get activities by project id", error);
            throw new Error("Error on get activities by project id");
        }
    }
}
