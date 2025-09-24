import { Repository } from "typeorm";
import { MetricsEntity } from "../entities/MetricsEntity";
import { AppDataSource } from "../config/data-base";
import { Metrics } from "../../domain/Metrics";
import { MetricsPort } from "../../domain/MetricsPort";
import { UserEntity } from "../entities/UserEntity";

export class MetricsAdapter implements MetricsPort {
    private metricsRepository: Repository<MetricsEntity>;

    constructor() {
        this.metricsRepository = AppDataSource.getRepository(MetricsEntity);
    }

    private toDomain(entity: MetricsEntity): Metrics {
        return {
            id_metrica: entity.id_metrica,
            id_usuario: entity.usuario.id_user,
            periodo: entity.periodo,
            tareas_completadas: entity.tareas_completadas,
            cumplimiento_tiempo: entity.cumplimiento_tiempo,
            eficiencia: entity.eficiencia,
            puntuacion_global: entity.puntuacion_global,
            status: entity.status ?? 1
        };
    }

    private async toEntity(metrics: Omit<Metrics, "id_metrica">): Promise<MetricsEntity> {
        const entity = new MetricsEntity();
        const userRepository = AppDataSource.getRepository(UserEntity);
        const user = await userRepository.findOneBy({ id_user: metrics.id_usuario });

        if (!user) throw new Error(`User with ID ${metrics.id_usuario} not found`);

        entity.usuario = user;
        entity.periodo = metrics.periodo;
        entity.tareas_completadas = metrics.tareas_completadas;
        entity.cumplimiento_tiempo = metrics.cumplimiento_tiempo;
        entity.eficiencia = metrics.eficiencia;
        entity.puntuacion_global = metrics.puntuacion_global;

        return entity;
    }

    async createMetrics(metrics: Omit<Metrics, "id_metrica">): Promise<number> {
        try {
            const entity = await this.toEntity(metrics);
            const saved = await this.metricsRepository.save(entity);
            return saved.id_metrica;
        } catch (error) {
            console.error("Error on create metrics", error);
            throw new Error("Error on create metrics");
        }
    }

    async updateMetrics(id: number, metrics: Partial<Metrics>): Promise<boolean> {
        try {
            const existing = await this.metricsRepository.findOne({
                where: { id_metrica: id },
                relations: ["usuario"]
            });

            if (!existing) throw new Error(`Metrics with ID ${id} not found`);

            if (metrics.periodo !== undefined) existing.periodo = metrics.periodo;
            if (metrics.tareas_completadas !== undefined) existing.tareas_completadas = metrics.tareas_completadas;
            if (metrics.cumplimiento_tiempo !== undefined) existing.cumplimiento_tiempo = metrics.cumplimiento_tiempo;
            if (metrics.eficiencia !== undefined) existing.eficiencia = metrics.eficiencia;
            if (metrics.puntuacion_global !== undefined) existing.puntuacion_global = metrics.puntuacion_global;
            if (metrics.status !== undefined) existing.status = metrics.status;

            if (metrics.id_usuario !== undefined) {
                const userRepository = AppDataSource.getRepository(UserEntity);
                const user = await userRepository.findOneBy({ id_user: metrics.id_usuario });
                if (!user) throw new Error(`User with ID ${metrics.id_usuario} not found`);
                existing.usuario = user;
            }

            await this.metricsRepository.save(existing);
            return true;
        } catch (error) {
            console.error("Error on update metrics", error);
            return false;
        }
    }

    async deleteMetrics(id: number): Promise<boolean> {
        try {
            const existing = await this.metricsRepository.findOneBy({ id_metrica: id });
            if (!existing) throw new Error(`Metrics with ID ${id} not found`);
            await this.metricsRepository.delete(id);
            return true;
        } catch (error) {
            console.error("Error on delete metrics", error);
            return false;
        }
    }

    async getMetricsById(id: number): Promise<Metrics | null> {
        try {
            const metrics = await this.metricsRepository.findOne({
                where: { id_metrica: id },
                relations: ["usuario"]
            });
            return metrics ? this.toDomain(metrics) : null;
        } catch (error) {
            console.error("Error on get metrics by id", error);
            throw new Error("Error on get metrics by id");
        }
    }

    async getMetricsByUserId(userId: number): Promise<Metrics[]> {
        try {
            const metricsList = await this.metricsRepository.find({
                where: { usuario: { id_user: userId } },
                relations: ["usuario"]
            });
            return metricsList.map(this.toDomain);
        } catch (error) {
            console.error("Error on get metrics by user id", error);
            throw new Error("Error on get metrics by user id");
        }
    }

    async getAllMetrics(): Promise<Metrics[]> {
        try {
            const metricsList = await this.metricsRepository.find({ relations: ["usuario"] });
            return metricsList.map(this.toDomain);
        } catch (error) {
            console.error("Error on get all metrics", error);
            throw new Error("Error on get all metrics");
        }
    }
}
