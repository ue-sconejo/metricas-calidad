import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('projects')
export class ProjectEntity {

    @PrimaryGeneratedColumn()
    id_proyecto!: number;

    @Column({ type: "varchar", length: 100 })
    nombre!: string;

    @Column({ type: "text", nullable: true })
    descripcion?: string;

    @Column({ type: "date", nullable: true })
    fecha_inicio?: string;

    @Column({ type: "date", nullable: true })
    fecha_fin?: string;

    @Column({ type: "int", default: 1 })
    estado: number | undefined;
}