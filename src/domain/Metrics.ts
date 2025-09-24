export interface Metrics {
    id_metrica: number;
    id_usuario: number;
    periodo: string;
    tareas_completadas: number;
    cumplimiento_tiempo?: number;
    eficiencia?: number;
    puntuacion_global?: number;
    status: number;
}
