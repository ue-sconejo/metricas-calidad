import { Metrics } from "../domain/Metrics";
import { MetricsPort } from "../domain/MetricsPort";

export class MetricsApplicationService {
    private port: MetricsPort;

    constructor(port: MetricsPort) {
        this.port = port;
    }

    async createMetrics(metrics: Omit<Metrics, "id_metrica">): Promise<number> {
        return await this.port.createMetrics(metrics);
    }

    async updateMetrics(id: number, metrics: Partial<Metrics>): Promise<boolean> {
        const existing = await this.port.getMetricsById(id);
        if (!existing) {
            throw new Error("No se encontró la métrica");
        }
        return await this.port.updateMetrics(id, metrics);
    }

    async deleteMetrics(id: number): Promise<boolean> {
        const existing = await this.port.getMetricsById(id);
        if (!existing) {
            throw new Error("No se encontró la métrica");
        }
        return await this.port.deleteMetrics(id);
    }

    async getAllMetrics(): Promise<Metrics[]> {
        return await this.port.getAllMetrics();
    }

    async getMetricsById(id: number): Promise<Metrics | null> {
        return await this.port.getMetricsById(id);
    }

    async getMetricsByUserId(userId: number): Promise<Metrics[]> {
        return await this.port.getMetricsByUserId(userId);
    }
}
