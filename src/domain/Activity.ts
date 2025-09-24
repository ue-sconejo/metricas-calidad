export interface Activity {
    id_actividad: number;
    nombre: string;
    descripcion?: string;
    fecha_inicio: string;
    fecha_fin: string;
    estado: number;
    id_proyecto: number;
    tipo: string;
}