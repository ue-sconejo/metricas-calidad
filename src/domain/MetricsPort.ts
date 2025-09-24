import { Metrics } from "./Metrics";

export interface MetricsPort {
    createMetrics(metrics: Omit<Metrics, "id_metrica">): Promise<number>;
    getAllMetrics(): Promise<Metrics[]>;
    getMetricsById(id: number): Promise<Metrics | null>;
    updateMetrics(id: number, metrics: Partial<Metrics>): Promise<boolean>;
    deleteMetrics(id: number): Promise<boolean>;
    getMetricsByUserId(userId: number): Promise<Metrics[]>;
}
