import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProjectEntity } from './ProjectEntity';
import { UserEntity } from './UserEntity';

@Entity('tasks')
export class TaskEntity {

    @PrimaryGeneratedColumn()
    id_tarea!: number;

    @ManyToOne(() => ProjectEntity, { nullable: false })
    @JoinColumn({ name: 'id_proyecto' })
    proyecto!: ProjectEntity;

    @ManyToOne(() => UserEntity, { nullable: false })
    @JoinColumn({ name: 'id_usuario' })
    usuario!: UserEntity;

    @Column({ type: "varchar", length: 100 })
    titulo!: string;

    @Column({ type: "text", nullable: true })
    descripcion?: string;

    @Column({ type: "date", nullable: true })
    fecha_asignacion?: string;

    @Column({ type: "date", nullable: true })
    fecha_entrega?: string;

    @Column({ type: "date", nullable: true })
    fecha_finalizacion?: string;

    @Column({ type: "varchar", length: 30, nullable: true })
    estado?: number;

    @Column({ type: "numeric", precision: 5, scale: 2, nullable: true })
    horas_estimadas?: number;

    @Column({ type: "numeric", precision: 5, scale: 2, nullable: true })
    horas_reales?: number;
}