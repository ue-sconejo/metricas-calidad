
import { Activity } from "../domain/Activity";
import { ActivityPort } from "../domain/ActivityPort";

export class ActivityApplication {
    private port: ActivityPort;

    constructor(port: ActivityPort) {
        this.port = port;
    }

    async createActivity(activity: Omit<Activity, "id_actividad">): Promise<number> {
        return await this.port.createActivity(activity);
    }

    async getAllActivities(): Promise<Activity[]> {
        return await this.port.getAllActivities();
    }

    async getActivityById(id: number): Promise<Activity | null> {
        return await this.port.getActivityById(id);
    }

    async updateActivity(id: number, activity: Partial<Activity>): Promise<boolean> {
        const existingActivity = await this.port.getActivityById(id);
        if (!existingActivity) {
            throw new Error("La actividad no existe");
        }

        return await this.port.updateActivity(id, activity);
    }

    async deleteActivity(id: number): Promise<boolean> {
        const existingActivity = await this.port.getActivityById(id);
        if (!existingActivity) {
            throw new Error("Actividad no encontrada");
        }

        return await this.port.deleteActivity(id);
    }

    async getActivitiesByProjectId(projectId: number): Promise<Activity[]> {
        return await this.port.getActivitiesByProjectId(projectId);
    }
}