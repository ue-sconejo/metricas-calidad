export interface Project {
    id_proyecto: number;
    nombre: string;
    descripcion?: string;
    fecha_inicio?: Date;
    fecha_fin?: Date;
    estado?: number;
}