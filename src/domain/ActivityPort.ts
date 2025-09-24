import { Activity } from "./Activity";

export interface ActivityPort {
    createActivity(activity: Omit<Activity, "id_actividad">): Promise<number>;
    getAllActivities(): Promise<Activity[]>;
    getActivityById(id: number): Promise<Activity | null>;
    updateActivity(id: number, activity: Partial<Activity>): Promise<boolean>;
    deleteActivity(id: number): Promise<boolean>;
    getActivitiesByProjectId(projectId: number): Promise<Activity[]>;
}
