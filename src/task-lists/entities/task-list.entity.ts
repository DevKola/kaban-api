import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { Board } from '../../boards/entities/board.entity';

@Entity()
export class TaskList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'int', default: 0 })
  position: number;

  @OneToMany(() => Task, (task) => task.taskList, { cascade: true })
  tasks: Task[];

  @ManyToOne(() => Board, (board) => board.taskLists, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  board: Board;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
