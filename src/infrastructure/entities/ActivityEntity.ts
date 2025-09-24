import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("actividades")
export class ActivityEntity {
    @PrimaryGeneratedColumn()
    id_actividad!: number;

    @Column({ type: "varchar", length: 100 })
    nombre!: string;

    @Column({ type: "text", nullable: true })
    descripcion?: string;

    @Column({ type: "date" })
    fecha_inicio!: string;

    @Column({ type: "date" })
    fecha_fin!: string;

    @Column({ type: "int" })
    estado!: number;

    @Column({ type: "int" })
    id_proyecto!: number;

    @Column({ type: "varchar", length: 50 }) // 👈 campo nuevo
    tipo!: string;
}