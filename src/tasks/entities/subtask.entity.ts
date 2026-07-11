import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from './task.entity';

@Entity()
export class Subtask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'boolean', default: false })
  isCompleted: boolean;

  @ManyToOne(() => Task, (task) => task.subtasks, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  task: Task;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
