import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './UserEntity';

@Entity('metrics')
export class MetricsEntity {

    @PrimaryGeneratedColumn()
    id_metrica!: number;

    @ManyToOne(() => UserEntity, { nullable: false })
    @JoinColumn({ name: 'id_usuario' })
    usuario!: UserEntity;

    @Column({ type: "varchar", length: 20 })
    periodo!: string;

    @Column({ type: "int", default: 0 })
    tareas_completadas!: number;

    @Column({ type: "numeric", precision: 5, scale: 2, nullable: true })
    cumplimiento_tiempo?: number;

    @Column({ type: "numeric", precision: 5, scale: 2, nullable: true })
    eficiencia?: number;

    @Column({ type: "numeric", precision: 5, scale: 2, nullable: true })
    puntuacion_global?: number;

    @Column({ type: "int", default: 1 })
    status!: number;
}